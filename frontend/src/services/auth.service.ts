import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import { TokenData, UserProfile } from '@/types/auth';

export const AuthService = {
  async register(data: { email: string; password: string; full_name: string }): Promise<ApiResponse<UserProfile>> {
    return apiClient.post<UserProfile>('/api/v1/auth/register', data);
  },

  async login(data: { email: string; password: string; totp_code?: string }): Promise<ApiResponse<TokenData>> {
    return apiClient.post<TokenData>('/api/v1/auth/login', data);
  },

  async refresh(refreshToken: string): Promise<ApiResponse<TokenData>> {
    return apiClient.post<TokenData>('/api/v1/auth/refresh', { refresh_token: refreshToken });
  },

  async logout(refreshToken: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/api/v1/auth/logout', { refresh_token: refreshToken });
  },

  async getMe(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>('/api/v1/auth/me');
  },

  async forgotPassword(email: string): Promise<ApiResponse<{ debug_token?: string }>> {
    return apiClient.post<{ debug_token?: string }>('/api/v1/auth/forgot-password', { email });
  },

  async resetPassword(token: string, new_password: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/api/v1/auth/reset-password', { token, new_password });
  },

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/api/v1/auth/verify-email', { token });
  },

  async getGitHubAuthUrl(): Promise<ApiResponse<{ url: string }>> {
    return apiClient.get<{ url: string }>('/api/v1/auth/oauth/github/url');
  },

  async getGoogleAuthUrl(): Promise<ApiResponse<{ url: string }>> {
    return apiClient.get<{ url: string }>('/api/v1/auth/oauth/google/url');
  },

  async handleGitHubCallback(code: string): Promise<ApiResponse<TokenData>> {
    return apiClient.post<TokenData>('/api/v1/auth/oauth/github/callback', { code });
  },

  async handleGoogleCallback(code: string): Promise<ApiResponse<TokenData>> {
    return apiClient.post<TokenData>('/api/v1/auth/oauth/google/callback', { code });
  },
};
