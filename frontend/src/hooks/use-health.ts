import { useState, useEffect } from 'react';
import { HealthService } from '@/services/health.service';
import { HealthStatus } from '@/types/api';

export function useHealth() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        setLoading(true);
        const response = await HealthService.getHealthStatus();
        setHealth(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to connect to backend server');
      } finally {
        setLoading(false);
      }
    }

    checkHealth();
  }, []);

  return { health, loading, error };
}
