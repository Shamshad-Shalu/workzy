import { useQuery } from '@tanstack/react-query';

import WorkerService from '@/services/worker.service';

export function useWorkerProfileDetails(workerId?: string) {
  return useQuery({
    queryKey: ['worker', workerId, 'profile-details'],
    queryFn: () => WorkerService.getWorkerProfileDetails(workerId!),
    enabled: !!workerId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
