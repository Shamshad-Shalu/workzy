import { useMutation, useQueryClient } from '@tanstack/react-query';

import AdminWorkerService from '@/services/admin/workerManagement.service';

import type { ReviewWorkerSchemaType } from '../validation/reviewWorkerShema';

export function useVerifyWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workerId, data }: { workerId: string; data: ReviewWorkerSchemaType }) =>
      AdminWorkerService.verifyWorker(workerId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workers'] });
    },
  });
}
