import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { Repository, RepositoryProgress } from '@/types/repository';

export const RepositoryService = {
  async connectUrl(data: { clone_url: string; default_branch: string; access_token?: string }): Promise<ApiResponse<Repository>> {
    return apiClient.post<Repository>('/api/v1/repositories/url', data);
  },

  async uploadZip(file: File): Promise<ApiResponse<Repository>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const response = await fetch(`${API_BASE_URL}/api/v1/repositories/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || 'ZIP upload failed.');
    }
    return result;
  },

  async listRepositories(): Promise<ApiResponse<Repository[]>> {
    return apiClient.get<Repository[]>('/api/v1/repositories');
  },

  async getRepository(id: string): Promise<ApiResponse<Repository>> {
    return apiClient.get<Repository>(`/api/v1/repositories/${id}`);
  },

  async getProgress(id: string): Promise<ApiResponse<RepositoryProgress>> {
    return apiClient.get<RepositoryProgress>(`/api/v1/repositories/${id}/progress`);
  },

  async deleteRepository(id: string): Promise<ApiResponse<void>> {
    return apiClient.request<void>(`/api/v1/repositories/${id}`, { method: 'DELETE' });
  },
};
