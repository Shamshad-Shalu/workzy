import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useWorker } from '@/features/profile/hooks/useWorker';
import WorkerProfileService from '@/services/worker/workerProfile.service';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/store';

import type { WorkerProfileSchemaType } from '../validation/workerProfileSchema';

export function useWorkerProfile() {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((s: RootState) => s.auth);
  const workerId = user?.workerId;

  const workerProfileQueries = useQuery({
    queryKey: ['worker', workerId, 'profile'],
    queryFn: () => WorkerProfileService.getWorkerProfileById(workerId!),
    enabled: !!workerId,
    staleTime: 1000 * 60 * 5,
  });

  const workerQueries = useWorker(workerId);
  const updateMutation = useMutation({
    mutationFn: (data: WorkerProfileSchemaType) =>
      WorkerProfileService.updateWorkerProfile(workerId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker', workerId, 'profile'] });
    },
  });
  const reload = () => queryClient.invalidateQueries({ queryKey: ['worker', workerId, 'summary'] });

  return {
    summaryQuery: workerQueries.summaryQuery,
    workerProfileQueries,
    updateMutation,
    reload,
  };
}
