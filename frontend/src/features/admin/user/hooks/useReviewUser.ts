import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/lib/react-query/queryClient';
import AdminUserService from '@/services/admin/userManagement.service';

export function useReviewUser() {
  return useMutation({
    mutationFn: (userId: string) => AdminUserService.toggleUserStatus(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-details', userId] });
    },
  });
}
