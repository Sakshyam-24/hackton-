import apiClient from '@/services/api';
import type { ChatResponse } from '@/types';

class ChatService {
  async sendMessage(data: {
    message: string;
    conversation_id?: string;
    category?: string;
    language?: 'en' | 'ne';
  }): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>('/api/v1/chat', data);
  }

  async getConversations(): Promise<{ conversations: any[]; total: number }> {
    return apiClient.get('/api/v1/chat');
  }

  async getConversation(id: string): Promise<{ id: string; messages: any[] }> {
    return apiClient.get(`/api/v1/chat/${id}`);
  }

  async deleteConversation(id: string): Promise<void> {
    await apiClient.del(`/api/v1/chat/${id}`);
  }
}

export const chatService = new ChatService();
export default chatService;
