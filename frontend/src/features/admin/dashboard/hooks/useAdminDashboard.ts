import { useQuery } from '@tanstack/react-query';

import { ADMIN_API } from '@/constants';
import api from '@/lib/api/axios';
import type { AdminDashboardAnalytics } from '@/types/admin/dashboard';
import type { ApiResponse } from '@/types/api';

const getAdminDashboardAnalytics = async (): Promise<AdminDashboardAnalytics> => {
  const res = await api.get<ApiResponse<AdminDashboardAnalytics>>(ADMIN_API.DASHBOARD);
  return res.data.data;
};

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => getAdminDashboardAnalytics(),
    staleTime: 1000 * 60 * 2,
  });
}
