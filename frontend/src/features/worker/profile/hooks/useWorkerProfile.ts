import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useWorker } from '@/features/profile/hooks/useWorker';
import WorkerProfileService from '@/services/worker/workerProfile.service';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';

import type { WorkerProfileSchemaType } from '../validation/workerProfileSchema';

export function useWorkerProfile() {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((s: RootState) => s.auth);
  const workerId = user?.workerId;

  // const updateWorkerProfile = useCallback(
  //   (data: WorkerProfileSchemaType) => {
  //     return WorkerProfileService.updateWorkerProfile(workerId, data);
  //   },
  //   [workerId]
  // );
  const workerQueries = useWorker(workerId);
  const updateMutation = useMutation({
    mutationFn: (data: WorkerProfileSchemaType) =>
      WorkerProfileService.updateWorkerProfile(workerId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-summary', workerId] });
    },
  });
  const reload = () => queryClient.invalidateQueries({ queryKey: ['worker-summary', workerId] });

  return {
    summaryQuery: workerQueries.summaryQuery,
    updateMutation,
    reload,
  };
}
