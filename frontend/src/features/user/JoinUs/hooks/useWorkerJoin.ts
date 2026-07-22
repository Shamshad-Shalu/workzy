import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import WorkerProfileService from '@/services/worker/workerProfile.service';

import type { JoinWorkerSchemaType } from '../validation/JoinWorkerFormSchema';

export function useMyWorkerProfile(userId?: string) {
  return useQuery({
    queryKey: ['worker', 'me'],
    queryFn: () => WorkerProfileService.getMyWorkerProfile(),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
}

export function useWorkerJoin() {
  const queryClient = useQueryClient();

  const joinWorker = useMutation({
    mutationFn: (data: JoinWorkerSchemaType) => WorkerProfileService.addWorkerProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker', 'me'] });
    },
  });

  const resubmitWorker = useMutation({
    mutationFn: ({ workerId, data }: { workerId: string; data: JoinWorkerSchemaType }) =>
      WorkerProfileService.reSubmitWorkerInfo(workerId, data),
    onSuccess: (_, { workerId }) => {
      queryClient.invalidateQueries({ queryKey: ['worker', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['admin-workers'] });
      queryClient.invalidateQueries({ queryKey: ['worker', workerId, 'profile-details'] });
    },
  });

  return {
    joinWorker: joinWorker.mutateAsync,
    resubmitWorker: resubmitWorker.mutateAsync,
    isPending: joinWorker.isPending || resubmitWorker.isPending,
  };
}
