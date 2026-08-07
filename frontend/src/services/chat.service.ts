import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { ChatSessionResponse, ChatMessageResponse } from '@/types/chat';

export const ChatService = {
  async createSession(repoId: string, title?: string): Promise<ApiResponse<ChatSessionResponse>> {
    return apiClient.post<ChatSessionResponse>(`/api/v1/repositories/${repoId}/chat/sessions`, { title });
  },

  async listSessions(repoId: string): Promise<ApiResponse<ChatSessionResponse[]>> {
    return apiClient.get<ChatSessionResponse[]>(`/api/v1/repositories/${repoId}/chat/sessions`);
  },

  async getSession(sessionId: string): Promise<ApiResponse<ChatSessionResponse>> {
    return apiClient.get<ChatSessionResponse>(`/api/v1/chat/sessions/${sessionId}`);
  },

  async sendMessage(sessionId: string, message: string): Promise<ApiResponse<ChatMessageResponse>> {
    return apiClient.post<ChatMessageResponse>(`/api/v1/chat/sessions/${sessionId}/messages`, { message });
  },
};
