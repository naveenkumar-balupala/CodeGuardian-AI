import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { CodeReviewResponse } from '@/types/code-review';

export const CodeReviewService = {
  async triggerReview(repoId: string): Promise<ApiResponse<CodeReviewResponse>> {
    return apiClient.post<CodeReviewResponse>(`/api/v1/repositories/${repoId}/review`, {});
  },

  async getLatestReview(repoId: string): Promise<ApiResponse<CodeReviewResponse>> {
    return apiClient.get<CodeReviewResponse>(`/api/v1/repositories/${repoId}/review/latest`);
  },
};
