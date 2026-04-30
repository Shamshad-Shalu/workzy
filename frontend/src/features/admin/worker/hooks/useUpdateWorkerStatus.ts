import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { WorkerStatus } from '@/constants';
import AdminWorkerService from '@/services/admin/workerManagement.service';

export function useUpdateWorkerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workerId, status }: { workerId: string; status: WorkerStatus }) =>
      AdminWorkerService.updateStatus(workerId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workers'] });
    },
  });
}
