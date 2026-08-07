export interface ApiResponse<T = any> {
  status: string;
  data: T;
  meta?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  services: {
    postgres: string;
    redis: string;
  };
}
