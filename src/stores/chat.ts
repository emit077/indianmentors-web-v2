import { defineStore } from 'pinia';
import { api } from '@/utils/api/axios';
import { useAuthStore } from '@/stores/auth';

interface User {
  id: number;
  name: string;
  mobile: string;
  account_type: string;
}

interface Message {
  id: number;
  conversation: number;
  sender: User;
  content: string;
  created_at: string;
  is_read?: boolean;
  is_delivered?: boolean;
  read_at?: string;
}

interface Conversation {
  id: number;
  conversation_type: 'one_to_one' | 'group';
  name?: string | null;
  created_by: number;
  participants: User[];
  last_message?: Message | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

interface WebSocketConnection {
  socket: WebSocket | null;
  conversationId: number;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [] as Conversation[],
    messages: [] as Message[],
    currentConversationId: null as number | null,
    webSockets: new Map<number, WebSocketConnection>(),
    isConnecting: false,
    baseWsUrl: import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000',
    websocketEnabled: import.meta.env.VITE_ENABLE_WEBSOCKET !== 'false', // Can be disabled
    websocketAvailable: true, // Tracks if WebSocket server is responding
    totalMessages: 0, // Total number of messages available
    currentOffset: 0, // Current offset for pagination
    messagesLimit: 50 // Number of messages to load per request
  }),

  getters: {
    getConversationById: (state) => (id: number) => {
      return state.conversations.find(c => c.id === id);
    },

    isConnected: (state) => (conversationId: number) => {
      const conn = state.webSockets.get(conversationId);
      return conn?.socket?.readyState === WebSocket.OPEN;
    },

    hasMoreMessages: (state) => {
      return state.currentOffset < state.totalMessages;
    }
  },

  actions: {
    /**
     * Load all conversations for the current user
     */
    async loadConversations() {
      try {
        const response: any = await api.get('/api/chat/conversations/');
        this.conversations = response as Conversation[];
      } catch (error: any) {
        console.error('Failed to load conversations:', error);
        this.conversations = [];
        throw error;
      }
    },

    async createConversation(payload: {
      conversation_type: 'one_to_one' | 'group';
      other_user_id?: number;
      name?: string;
      participant_ids?: number[];
    }) {
      try {
        const conversation = await api.post('/api/chat/conversations/create/', payload) as Conversation;

        const existingIndex = this.conversations.findIndex(c => c.id === conversation.id);
        if (existingIndex !== -1) {
          this.conversations[existingIndex] = conversation;
        } else {
          this.conversations.unshift(conversation);
        }

        await this.connectToConversation(conversation.id);
        return conversation;
      } catch (error) {
        console.error('Failed to create conversation:', error);
        throw error;
      }
    },

    /**
     * Load historical messages via REST API
     * WebSocket is only used for live updates after initial load
     */
    async loadMessages(conversationId: number, limit: number = 50, offset: number = 0) {
      try {
        this.currentConversationId = conversationId;

        const response: any = await api.get(
          `/api/chat/conversations/${conversationId}/messages/`,
          { params: { limit, offset } }
        );

        // Axios wrapper unwraps response.data.result automatically
        const messagesData = response?.messages || response;
        this.messages = (Array.isArray(messagesData) ? messagesData : []) as Message[];

        // Track total and offset for pagination
        this.totalMessages = response?.total || this.messages.length;
        this.currentOffset = offset + this.messages.length;

        // Reverse to show oldest first (backend returns newest first)
        this.messages.reverse();

        // Connect WebSocket for live updates
        if (this.websocketEnabled && this.websocketAvailable && !this.isConnected(conversationId)) {
          await this.connectToConversation(conversationId);
        }
      } catch (error: any) {
        console.error('Failed to load messages:', error);
        throw error;
      }
    },

    /**
     * Load more (older) messages and prepend to existing messages
     */
    async loadMoreMessages(conversationId: number) {
      try {
        const response: any = await api.get(
          `/api/chat/conversations/${conversationId}/messages/`,
          { params: { limit: this.messagesLimit, offset: this.currentOffset } }
        );

        const messagesData = response?.messages || response;
        const olderMessages = (Array.isArray(messagesData) ? messagesData : []) as Message[];

        // Update total and offset
        this.totalMessages = response?.total || this.totalMessages;
        this.currentOffset += olderMessages.length;

        // Reverse and prepend older messages
        olderMessages.reverse();
        this.messages = [...olderMessages, ...this.messages];

        return olderMessages.length;
      } catch (error: any) {
        console.error('Failed to load more messages:', error);
        throw error;
      }
    },

    async sendMessage(conversationId: number, content: string) {
      try {
        // Try WebSocket first for instant delivery
        if (this.isConnected(conversationId)) {
          const conn = this.webSockets.get(conversationId);
          if (conn?.socket) {
            conn.socket.send(JSON.stringify({ type: 'message', content }));
            // Message will come back via WebSocket with proper status
            return;
          }
        }

        // Fallback to REST API
        const message = await api.post(`/api/chat/conversations/${conversationId}/messages/send/`, {
          content
        }) as Message;

        // Mark as sent (will be delivered when other user receives it)
        message.is_delivered = false;
        message.is_read = false;

        if (this.currentConversationId === conversationId) {
          this.messages.push(message);
        }

        const conversation = this.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.last_message = message;
          conversation.updated_at = message.created_at;
        }

        return message;
      } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
      }
    },

    /**
     * Connect to a conversation's WebSocket for live updates only
     * Historical messages are loaded via REST API
     */
    async connectToConversation(conversationId: number) {
      // Check if WebSocket is enabled and available
      if (!this.websocketEnabled || !this.websocketAvailable) {
        return;
      }

      const authStore = useAuthStore();
      const user = authStore.getUser();
      const token = user?.token || user?.access_token || localStorage.getItem('access_token');

      if (!token) {
        return;
      }

      // Check if already connected
      if (this.isConnected(conversationId)) {
        return;
      }

      // Initialize connection object if it doesn't exist
      if (!this.webSockets.has(conversationId)) {
        this.webSockets.set(conversationId, {
          socket: null,
          conversationId,
          reconnectAttempts: 0,
          maxReconnectAttempts: 3 // Reduced attempts
        });
      }

      const conn = this.webSockets.get(conversationId)!;

      try {
        this.isConnecting = true;

        // Close existing socket if any
        if (conn.socket) {
          conn.socket.close();
        }

        // Create WebSocket URL
        const wsUrl = `${this.baseWsUrl}/ws/chat/${conversationId}/?token=${token}`;
        const socket = new WebSocket(wsUrl);
        conn.socket = socket;

        // WebSocket event handlers
        socket.onopen = () => {
          conn.reconnectAttempts = 0;
          this.isConnecting = false;
          this.websocketAvailable = true;
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(conversationId, data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        socket.onerror = () => {
          this.isConnecting = false;
          if (conn.reconnectAttempts === 0) {
            this.websocketAvailable = false;
          }
        };

        socket.onclose = (event) => {
          this.isConnecting = false;

          // Connection refused or not configured
          if (event.code === 1006 || event.code === 1002 || event.reason?.includes('404')) {
            this.websocketAvailable = false;
            return;
          }

          // Attempt to reconnect for normal disconnections
          if (event.code !== 1000 && this.websocketAvailable && conn.reconnectAttempts < conn.maxReconnectAttempts) {
            conn.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, conn.reconnectAttempts), 10000);

            setTimeout(() => {
              if (this.currentConversationId === conversationId && this.websocketAvailable) {
                this.connectToConversation(conversationId);
              }
            }, delay);
          } else if (conn.reconnectAttempts >= conn.maxReconnectAttempts) {
            this.websocketAvailable = false;
          }
        };
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        this.isConnecting = false;
        throw error;
      }
    },

    /**
     * Handle incoming WebSocket messages
     */
    handleWebSocketMessage(conversationId: number, data: any) {
      // Handle message status updates (read/delivered)
      if (data.type === 'message_status' && data.message_id) {
        this.updateMessageStatus(data.message_id, data.is_read, data.is_delivered);
        return;
      }

      // Handle new message
      if (data.id && data.content && data.sender) {
        const message = data as Message;

        // Mark as delivered if it's for current conversation
        if (this.currentConversationId === conversationId) {
          message.is_delivered = true;

          // Avoid duplicates
          const exists = this.messages.some(m => m.id === message.id);
          if (!exists) {
            this.messages.push(message);

            // Auto-mark as read if conversation is active
            if (message.sender.id !== this.getCurrentUserId()) {
              this.markAsRead(conversationId);
            }
          }
        }

        // Update last message in conversations list
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.last_message = message;
          conversation.updated_at = message.created_at;

          // Increment unread count if not the current conversation
          if (this.currentConversationId !== conversationId) {
            conversation.unread_count = (conversation.unread_count || 0) + 1;
          } else {
            conversation.unread_count = 0;
          }
        } else {
          this.loadConversations();
        }
      } else {
        console.warn('Received unknown WebSocket data format:', data);
      }
    },

    /**
     * Update message status (read/delivered)
     */
    updateMessageStatus(messageId: number, isRead?: boolean, isDelivered?: boolean) {
      const message = this.messages.find(m => m.id === messageId);
      if (message) {
        if (isRead !== undefined) message.is_read = isRead;
        if (isDelivered !== undefined) message.is_delivered = isDelivered;
      }

      // Also update in conversations' last message
      this.conversations.forEach(conv => {
        if (conv.last_message?.id === messageId) {
          if (isRead !== undefined) conv.last_message.is_read = isRead;
          if (isDelivered !== undefined) conv.last_message.is_delivered = isDelivered;
        }
      });
    },

    /**
     * Get current user ID
     */
    getCurrentUserId(): number {
      const authStore = useAuthStore();
      return authStore.user?.id || authStore.user?.user_id || 0;
    },

    /**
     * Disconnect from a conversation's WebSocket
     */
    disconnectFromConversation(conversationId: number) {
      const conn = this.webSockets.get(conversationId);
      if (conn?.socket) {
        conn.socket.close(1000, 'User disconnected');
        this.webSockets.delete(conversationId);
      }
    },

    /**
     * Disconnect from all WebSockets
     */
    disconnectAll() {
      this.webSockets.forEach((conn) => {
        if (conn.socket) {
          conn.socket.close(1000, 'User disconnected from all conversations');
        }
      });
      this.webSockets.clear();
    },

    /**
     * Mark messages as read (not needed - backend auto-marks on fetch)
     * Keeping for manual marking if needed
     */
    async markAsRead(conversationId: number) {
      try {
        await api.post(`/api/chat/conversations/${conversationId}/read/`);

        // Update unread count locally
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.unread_count = 0;
        }
      } catch (error) {
        console.error('Failed to mark messages as read:', error);
      }
    },

    /**
     * Send typing indicator
     */
    sendTypingIndicator(conversationId: number, isTyping: boolean) {
      const conn = this.webSockets.get(conversationId);
      if (conn?.socket?.readyState === WebSocket.OPEN) {
        conn.socket.send(JSON.stringify({
          type: 'typing',
          typing: isTyping
        }));
      }
    },

    /**
     * Delete a conversation
     */
    async deleteConversation(conversationId: number) {
      try {
        await api.delete(`/api/chat/conversations/${conversationId}/`);

        // Remove from local state
        this.conversations = this.conversations.filter(c => c.id !== conversationId);

        // Disconnect WebSocket
        this.disconnectFromConversation(conversationId);

        // Clear current conversation if it was deleted
        if (this.currentConversationId === conversationId) {
          this.currentConversationId = null;
          this.messages = [];
        }
      } catch (error) {
        console.error('Failed to delete conversation:', error);
        throw error;
      }
    }
  }
});
