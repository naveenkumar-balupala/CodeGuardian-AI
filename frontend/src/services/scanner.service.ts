import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { RepositoryAnalysis } from '@/types/scanner';

export const ScannerService = {
  async triggerScan(repoId: string): Promise<ApiResponse<RepositoryAnalysis>> {
    return apiClient.post<RepositoryAnalysis>(`/api/v1/repositories/${repoId}/scan-tech`, {});
  },

  async getAnalysis(repoId: string): Promise<ApiResponse<RepositoryAnalysis>> {
    return apiClient.get<RepositoryAnalysis>(`/api/v1/repositories/${repoId}/analysis`);
  },
};
