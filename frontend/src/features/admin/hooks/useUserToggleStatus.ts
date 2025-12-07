import AdminUserService from '@/services/admin/userManagement.service';
import { handleApiError } from '@/utils/handleApiError';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useToggleStatus = (onClose: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: id => AdminUserService.toggleStatus(id),
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onClose();
    },
    onError: error => {
      toast.error(handleApiError(error));
    },
  });
};
