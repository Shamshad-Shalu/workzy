import { useInfiniteQuery } from '@tanstack/react-query';

import { reviewKeys } from '@/features/review';
import ReviewService from '@/services/review.service';
import type { PublicReviewListResponse, ReviewListQuery } from '@/types/review';

const LIMIT = 5;

export function useWorkerPublicReviews(
  workerId: string | undefined,
  query: Omit<ReviewListQuery, 'cursor' | 'limit'>
) {
  return useInfiniteQuery<
    PublicReviewListResponse,
    Error,
    { pages: PublicReviewListResponse[]; pageParams: (string | undefined)[] },
    ReturnType<typeof reviewKeys.public>,
    string | undefined
  >({
    queryKey: reviewKeys.public(workerId ?? 'disabled', query),
    queryFn: ({ pageParam }) =>
      ReviewService.getWorkerPublicReviews(workerId!, {
        limit: LIMIT,
        cursor: pageParam,
        ...query,
      }),
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    enabled: !!workerId,
  });
}
