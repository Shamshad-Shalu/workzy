import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import AdminUserService from '@/services/admin/userManagement.service';
import type { AdminUserListQuery } from '@/types/admin/user';

export function useAdminUsers({
  page,
  limit,
  search,
  status = 'all',
  role = 'all',
}: AdminUserListQuery) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-users', page, limit, search ?? '', status ?? 'all', role ?? 'all'],
    queryFn: () => AdminUserService.getUsers({ page: page + 1, limit, search, status, role }),
    placeholderData: prev => prev,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (userId: string) => AdminUserService.toggleUserStatus(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  return {
    // data
    users: query.data?.users ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,

    // actions
    toggleUserStatus: toggleStatusMutation.mutateAsync,
    isToggling: toggleStatusMutation.isPending,
  };
}
