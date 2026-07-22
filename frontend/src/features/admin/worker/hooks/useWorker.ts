import { useMutation, useQueryClient } from '@tanstack/react-query';

import AdminWorkerService from '@/services/admin/workerManagement.service';

export function useWorkerStatusToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workerId, reason }: { workerId: string; reason?: string }) =>
      AdminWorkerService.updateStatus(workerId, reason),

    onSuccess: (_, { workerId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-workers'] });
      queryClient.invalidateQueries({ queryKey: ['worker', workerId, 'profile-details'] });
    },
  });
}
