import { useQuery } from '@tanstack/react-query';

import { reviewKeys } from '@/features/review';
import ReviewService from '@/services/review.service';
import type { Review } from '@/types/review';


export function useReviewDetails(reviewId?: string | null) {
  return useQuery<Review>({
    queryKey: reviewKeys.detail(reviewId!),
    queryFn: async () => {
      const res = await ReviewService.getReviewById(reviewId!);
      return res;
    },
    enabled: !!reviewId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
