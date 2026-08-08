import { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    // Dynamically retrieve access token from client localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    };

    try {
      const response = await fetch(url, {
        mode: 'cors',
        ...options,
        headers,
      });

      // Handle 401 Unauthorized with automatic token refresh attempt
      if (
        response.status === 401 &&
        !isRetry &&
        !endpoint.includes('/auth/login') &&
        !endpoint.includes('/auth/refresh')
      ) {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
        if (refreshToken) {
          try {
            const refreshResp = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
              method: 'POST',
              mode: 'cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (refreshResp.ok) {
              const refreshData = await refreshResp.json();
              const newToken = refreshData.data?.access_token;
              if (newToken) {
                localStorage.setItem('access_token', newToken);
                if (refreshData.data?.refresh_token) {
                  localStorage.setItem('refresh_token', refreshData.data.refresh_token);
                }
                // Retry request with new token
                return this.request<T>(endpoint, options, true);
              }
            }
          } catch {
            // Token refresh failed
          }
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      // Intercept raw TypeError: Failed to fetch (CORS/Network connection failure)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const customErr = new Error(
          `Unable to connect to CodeGuardian AI backend server at ${this.baseUrl}. Please verify the API server is running.`
        );
        console.error(`API Network Failure [${endpoint}]:`, customErr);
        throw customErr;
      }
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  public get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(
    endpoint: string,
    body: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public put<T>(
    endpoint: string,
    body: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public patch<T>(
    endpoint: string,
    body: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
