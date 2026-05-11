import { useQuery } from '@tanstack/react-query';

import WorkerService from '@/services/worker.service';

export function useWorkerDashboard() {
  return useQuery({
    queryKey: ['worker-dashboard'],
    queryFn: () => WorkerService.getWorkerDashboardAnalytics(),
    staleTime: 1000 * 60 * 2,
  });
}
