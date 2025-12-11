import AdminService from '@/services/admin/serviceManagement.service';
import type { ServiceDTO } from '@/types/admin/service';
import { handleApiError } from '@/utils/handleApiError';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useServiceMutations() {
  const queryClient = useQueryClient();

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceDTO }) =>
      AdminService.updateService(id, data),
    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
    onError: err => {
      toast.error(handleApiError(err));
    },
  });
  const addServiceMutation = useMutation({
    mutationFn: (data: ServiceDTO) => AdminService.createService(data),

    onSuccess: res => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },

    onError: err => {
      toast.error(handleApiError(err));
    },
  });

  const toggleStatusMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: id => AdminService.toggleStatus(id),
    onSuccess: data => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    },
    onError: error => {
      toast.error(handleApiError(error));
    },
  });

  return { updateServiceMutation, addServiceMutation, toggleStatusMutation };
}
