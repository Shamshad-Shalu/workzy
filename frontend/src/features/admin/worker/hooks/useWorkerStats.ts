import { useQuery } from '@tanstack/react-query';

import AdminWorkerService from '@/services/admin/workerManagement.service';

export function useWorkerStats(workerId?: string) {
  return useQuery({
    queryKey: ['worker', workerId, 'stats'],
    queryFn: () => AdminWorkerService.getWorkerStats(workerId!),
    enabled: !!workerId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
