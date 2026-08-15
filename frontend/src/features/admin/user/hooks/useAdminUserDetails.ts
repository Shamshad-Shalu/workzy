import { useQuery } from '@tanstack/react-query';

import AdminUserService from '@/services/admin/userManagement.service';

export function useAdminUserDetails(userId?: string) {
  return useQuery({
    queryKey: ['admin-user-details', userId],
    queryFn: async () => await AdminUserService.getUserDetails(userId!),
    enabled: !!userId,
  });
}

export function useAdminUserStats(userId?: string) {
  return useQuery({
    queryKey: ['admin-user-stats', userId],
    queryFn: async () => {
      return await AdminUserService.getUserStats(userId!);
    },
    enabled: !!userId,
  });
}
