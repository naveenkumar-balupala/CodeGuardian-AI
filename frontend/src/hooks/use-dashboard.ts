'use client';

import { useState, useEffect } from 'react';
import { DashboardSummary } from '@/types/dashboard';
import { DashboardService } from '@/services/dashboard.service';

export function useDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await DashboardService.getSummary();
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // Auto refresh every 60 seconds
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refresh: fetchDashboard };
}
