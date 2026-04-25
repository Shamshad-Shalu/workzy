import { useInfiniteQuery } from '@tanstack/react-query';

import { reviewKeys } from '@/features/user/worker/hooks/useWorkerReviews';
import ReviewService from '@/services/review.service';
import type { AdminReviewListQuery, AdminReviewListResponse } from '@/types/review';

const LIMIT = 3;

export function useAdminReviews(query: Omit<AdminReviewListQuery, 'cursor' | 'limit'>) {
  return useInfiniteQuery<
    AdminReviewListResponse,
    Error,
    { pages: AdminReviewListResponse[]; pageParams: (string | undefined)[] },
    ReturnType<typeof reviewKeys.admin>,
    string | undefined
  >({
    queryKey: reviewKeys.admin(query),
    queryFn: ({ pageParam }) =>
      ReviewService.listReviews({
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
