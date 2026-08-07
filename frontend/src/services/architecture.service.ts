import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { ArchitectureReportResponse } from '@/types/architecture';

export const ArchitectureService = {
  async triggerScan(repoId: string): Promise<ApiResponse<ArchitectureReportResponse>> {
    return apiClient.post<ArchitectureReportResponse>(`/api/v1/repositories/${repoId}/architecture/scan`, {});
  },

  async getLatestReport(repoId: string): Promise<ApiResponse<ArchitectureReportResponse>> {
    return apiClient.get<ArchitectureReportResponse>(`/api/v1/repositories/${repoId}/architecture/report`);
  },
};
