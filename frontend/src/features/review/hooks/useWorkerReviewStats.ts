import { useQuery } from '@tanstack/react-query';

import { reviewKeys } from '@/features/review';
import ReviewService from '@/services/review.service';

export function useWorkerReviewStats(workerId?: string) {
  return useQuery({
    queryKey: reviewKeys.workerStats(workerId),
    queryFn: () => ReviewService.getWorkerReviewStats(workerId!),
    enabled: !!workerId,
  });
}
