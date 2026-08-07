import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { OrchestrateResponse, ChatMessage, ChatResponse } from '@/types/ai-agents';

export const AIAgentsService = {
  async orchestrateAudit(repoId: string): Promise<ApiResponse<OrchestrateResponse>> {
    return apiClient.post<OrchestrateResponse>(`/api/v1/ai/agents/orchestrate/${repoId}`, {});
  },

  async chat(query: string, history: ChatMessage[]): Promise<ApiResponse<ChatResponse>> {
    return apiClient.post<ChatResponse>('/api/v1/ai/agents/chat', {
      query,
      history: history.map((h) => ({ role: h.role, content: h.content })),
    });
  },
};
