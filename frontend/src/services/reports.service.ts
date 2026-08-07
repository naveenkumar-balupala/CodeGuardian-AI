import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { ReportExportRequest, ReportExportResponse } from '@/types/reports';

export const ReportsService = {
  async generateReport(repoId: string, req: ReportExportRequest): Promise<ApiResponse<ReportExportResponse>> {
    return apiClient.post<ReportExportResponse>(`/api/v1/repositories/${repoId}/reports/generate`, req);
  },

  async listReports(repoId: string): Promise<ApiResponse<ReportExportResponse[]>> {
    return apiClient.get<ReportExportResponse[]>(`/api/v1/repositories/${repoId}/reports`);
  },

  getDownloadUrl(fileName: string): string {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/reports/download/${fileName}`;
  },
};
