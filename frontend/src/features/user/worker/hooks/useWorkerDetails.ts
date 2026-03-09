import { useQuery } from '@tanstack/react-query';

import WorkerService from '@/services/worker.service';

export function useWorkerDetails(workerId: string | undefined) {
  return useQuery({
    queryKey: ['worker-detail', workerId],
    queryFn: () => WorkerService.getWorkerSummaryById(workerId!),
    enabled: !!workerId,
    staleTime: 1000 * 60 * 5,
  });
}
