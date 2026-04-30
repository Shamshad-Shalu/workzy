import { useQuery } from '@tanstack/react-query';

import WorkerService from '@/services/worker.service';

export function useWorkerProfile(workerId: string | undefined) {
  return useQuery({
    queryKey: ['worker', workerId, 'profile'],
    queryFn: () => WorkerService.getWorkerProfile(workerId!),
    enabled: !!workerId,
    staleTime: 1000 * 60 * 5,
    select: data => data.worker,
  });
}
