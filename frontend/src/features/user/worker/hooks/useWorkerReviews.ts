import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import ReviewService from '@/services/review.service';
import type {
  AdminReviewListQuery,
  PublicReviewListResponse,
  ReviewListQuery,
  WorkerReviewStats,
} from '@/types/review';

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  user: (filters: Omit<ReviewListQuery, 'cursor' | 'limit'>) =>
    [...reviewKeys.lists(), 'user', filters] as const,
  worker: (filters?: Omit<ReviewListQuery, 'cursor' | 'limit'>) =>
    [...reviewKeys.lists(), 'worker', filters] as const,
  public: (workerId: string, filters: Omit<ReviewListQuery, 'cursor' | 'limit'>) =>
    [...reviewKeys.lists(), 'public', workerId, filters] as const,
  admin: (filters: Omit<AdminReviewListQuery, 'cursor' | 'limit'>) =>
    [...reviewKeys.lists(), 'admin', filters] as const,
  detail: (id: string) => [...reviewKeys.all, 'detail', id] as const,
};

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
      ReviewService.getPublicWorkerReviews(workerId!, {
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

export function useWorkerReviewStats(workerId?: string) {
  return useQuery<WorkerReviewStats, Error>({
    queryKey: ['worker-review-stats', workerId],
    queryFn: () => ReviewService.getWorkerReviewStats(workerId!),
    enabled: !!workerId,
  });
}
