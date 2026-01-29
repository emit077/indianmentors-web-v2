import { api } from '@/utils/api/axios';

export interface User {
  id: number;
  name: string;
  mobile: string;
  account_type: string;
}

export interface CreateConversationPayload {
  conversation_type: 'one_to_one' | 'group';
  other_user_id?: number;
  name?: string;
  participant_ids?: number[];
}

export interface SendMessagePayload {
  content: string;
}

/**
 * Chat Service for API interactions
 */
export class ChatService {
  /**
   * Get all conversations for the current user
   */
  static async getConversations() {
    return api.get('/api/chat/conversations/');
  }

  /**
   * Create a new conversation
   */
  static async createConversation(payload: CreateConversationPayload) {
    return api.post('/api/chat/conversations/create/', payload);
  }

  /**
   * Get messages for a specific conversation
   */
  static async getMessages(conversationId: number) {
    return api.get(`/api/chat/conversations/${conversationId}/messages/`);
  }

  /**
   * Send a message via REST API
   */
  static async sendMessage(conversationId: number, payload: SendMessagePayload) {
    return api.post(`/api/chat/conversations/${conversationId}/messages/send/`, payload);
  }

  /**
   * Mark conversation as read
   */
  static async markAsRead(conversationId: number) {
    return api.post(`/api/chat/conversations/${conversationId}/mark_read/`);
  }

  /**
   * Delete a conversation
   */
  static async deleteConversation(conversationId: number) {
    return api.delete(`/api/chat/conversations/${conversationId}/`);
  }

  /**
   * Get list of users (for creating new conversations)
   */
  static async getUsers(search?: string) {
    const params = search ? { search } : {};
    return api.get('/api/users/', { params });
  }

  /**
   * Get conversation details
   */
  static async getConversation(conversationId: number) {
    return api.get(`/api/chat/conversations/${conversationId}/`);
  }

  /**
   * Add participant to group conversation
   */
  static async addParticipant(conversationId: number, userId: number) {
    return api.post(`/api/chat/conversations/${conversationId}/add_participant/`, {
      user_id: userId
    });
  }

  /**
   * Remove participant from group conversation
   */
  static async removeParticipant(conversationId: number, userId: number) {
    return api.post(`/api/chat/conversations/${conversationId}/remove_participant/`, {
      user_id: userId
    });
  }

  /**
   * Leave a group conversation
   */
  static async leaveConversation(conversationId: number) {
    return api.post(`/api/chat/conversations/${conversationId}/leave/`);
  }

  /**
   * Update conversation (e.g., change group name)
   */
  static async updateConversation(conversationId: number, data: Partial<{ name: string }>) {
    return api.patch(`/api/chat/conversations/${conversationId}/`, data);
  }
}
