import { useInfiniteQuery } from '@tanstack/react-query';

import { reviewKeys } from '@/features/review';
import ReviewService from '@/services/review.service';
import type { WorkerReviewListResponse, ReviewListQuery } from '@/types/review';

const LIMIT = 4;

export function useWorkerReviews(query?: Omit<ReviewListQuery, 'cursor' | 'limit'>) {
  return useInfiniteQuery<
    WorkerReviewListResponse,
    Error,
    { pages: WorkerReviewListResponse[]; pageParams: (string | undefined)[] },
    ReturnType<typeof reviewKeys.worker>,
    string | undefined
  >({
    queryKey: reviewKeys.worker(query),
    queryFn: ({ pageParam }) =>
      ReviewService.getWorkerOwnReviews({
        limit: LIMIT,
        cursor: pageParam,
        ...query,
      }),
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}
