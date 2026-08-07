import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { DashboardSummary } from '@/types/dashboard';

export const DashboardService = {
  async getSummary(): Promise<ApiResponse<DashboardSummary>> {
    return apiClient.get<DashboardSummary>('/api/v1/dashboard/summary');
  },
};
