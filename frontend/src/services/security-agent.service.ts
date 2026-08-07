import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { SecurityAgentReportResponse } from '@/types/security-agent';

export const SecurityAgentService = {
  async triggerScan(repoId: string): Promise<ApiResponse<SecurityAgentReportResponse>> {
    return apiClient.post<SecurityAgentReportResponse>(`/api/v1/repositories/${repoId}/security-agent/scan`, {});
  },

  async getLatestReport(repoId: string): Promise<ApiResponse<SecurityAgentReportResponse>> {
    return apiClient.get<SecurityAgentReportResponse>(`/api/v1/repositories/${repoId}/security-agent/report`);
  },
};
