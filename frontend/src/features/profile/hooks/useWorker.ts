import { useQuery } from '@tanstack/react-query';

import WorkerService from '@/services/worker.service';

export function useWorker(workerId: string | undefined) {
  const summaryQuery = useQuery({
    queryKey: ['worker', workerId, 'summary'],
    queryFn: () => WorkerService.getWorkerSummaryById(workerId!),
    enabled: !!workerId,
    staleTime: 1000 * 60 * 5,
  });
  // const serviceQuery = useQuery({
  //   queryKey: ['worker-service', workerId],
  //   queryFn: () => WorkerService.getWorkerSummaryById(workerId!),
  //   enabled: !!workerId,
  //   staleTime: 1000 * 60 * 5,
  // });

  return {
    summaryQuery,
    // serviceQuery,
  };
}
