import { apiClient } from '@/lib/api-client';
import { ApiResponse, HealthStatus } from '@/types/api';

export const HealthService = {
  async getHealthStatus(): Promise<ApiResponse<HealthStatus>> {
    return apiClient.get<HealthStatus>('/api/v1/health');
  },
};
