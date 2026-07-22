import { useMutation, useQueryClient } from '@tanstack/react-query';

import AdminWorkerService from '@/services/admin/workerManagement.service';

import type { WorkerReviewFormType } from '../validation/workerReviewSchema';

export function useReviewWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workerId, data }: { workerId: string; data: WorkerReviewFormType }) =>
      AdminWorkerService.reviewWorker(workerId, data),

    onSuccess: (_, { workerId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-workers'] });
      queryClient.invalidateQueries({ queryKey: ['worker', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['worker', workerId, 'profile-details'] });
    },
  });
}
