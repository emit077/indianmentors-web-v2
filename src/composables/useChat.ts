import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useChatStore } from '@/stores/chat';
import { ChatService } from '@/services/chatService';
import type { User } from '@/services/chatService';

/**
 * Composable for chat functionality
 */
export function useChat() {
  const chatStore = useChatStore();
  
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Load conversations
   */
  const loadConversations = async () => {
    loading.value = true;
    error.value = null;
    try {
      await chatStore.loadConversations();
    } catch (e: any) {
      error.value = e.message || 'Failed to load conversations';
      console.error('Error loading conversations:', e);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Load messages for a conversation
   */
  const loadMessages = async (conversationId: number) => {
    loading.value = true;
    error.value = null;
    try {
      await chatStore.loadMessages(conversationId);
    } catch (e: any) {
      error.value = e.message || 'Failed to load messages';
      console.error('Error loading messages:', e);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Send a message
   */
  const sendMessage = async (conversationId: number, content: string) => {
    error.value = null;
    try {
      await chatStore.sendMessage(conversationId, content);
    } catch (e: any) {
      error.value = e.message || 'Failed to send message';
      console.error('Error sending message:', e);
      throw e;
    }
  };

  /**
   * Create a new conversation
   */
  const createConversation = async (payload: {
    conversation_type: 'one_to_one' | 'group';
    other_user_id?: number;
    name?: string;
    participant_ids?: number[];
  }) => {
    loading.value = true;
    error.value = null;
    try {
      const conversation = await chatStore.createConversation(payload);
      return conversation;
    } catch (e: any) {
      error.value = e.message || 'Failed to create conversation';
      console.error('Error creating conversation:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    conversations: computed(() => chatStore.conversations),
    messages: computed(() => chatStore.messages),
    currentConversationId: computed(() => chatStore.currentConversationId),
    loadConversations,
    loadMessages,
    sendMessage,
    createConversation,
    connectToConversation: chatStore.connectToConversation.bind(chatStore),
    disconnectFromConversation: chatStore.disconnectFromConversation.bind(chatStore),
    isConnected: (conversationId: number) => chatStore.isConnected(conversationId)
  };
}

/**
 * Composable for user search (for creating new chats)
 */
export function useUserSearch() {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const searchUsers = async (query?: string) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await ChatService.getUsers(query) as User[];
      users.value = result;
      return users.value;
    } catch (e: any) {
      error.value = e.message || 'Failed to search users';
      console.error('Error searching users:', e);
      return [];
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    loading,
    error,
    searchUsers
  };
}

/**
 * Composable for WebSocket connection management
 */
export function useWebSocket(conversationId: number) {
  const chatStore = useChatStore();
  const connected = computed(() => chatStore.isConnected(conversationId));

  const connect = async () => {
    await chatStore.connectToConversation(conversationId);
  };

  const disconnect = () => {
    chatStore.disconnectFromConversation(conversationId);
  };

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    connected,
    connect,
    disconnect
  };
}
