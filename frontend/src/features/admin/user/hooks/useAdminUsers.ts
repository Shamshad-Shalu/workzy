import { useQuery } from '@tanstack/react-query';

import AdminUserService from '@/services/admin/userManagement.service';
import type { AdminUserListQuery } from '@/types/admin/user';

export function useAdminUsers({
  page,
  limit,
  search,
  status = 'all',
  role = 'all',
}: AdminUserListQuery) {
  const query = useQuery({
    queryKey: ['admin-users', page, limit, search ?? '', status ?? 'all', role ?? 'all'],
    queryFn: () => AdminUserService.getUsers({ page: page + 1, limit, search, status, role }),
    placeholderData: prev => prev,
  });

  return {
    // data
    users: query.data?.users ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
