import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { disputeService } from '@/services/dispute.service';
import type { DisputeListQuery } from '@/types/dispute';

const LIMIT = 5;

export function useDisputes(filters: Omit<DisputeListQuery, 'limit' | 'cursor'>) {
  return useInfiniteQuery({
    queryKey: ['disputes', filters] as const,
    queryFn: ({ pageParam }) =>
      disputeService.getAllDisputes({
        ...filters,
        limit: LIMIT,
        cursor: pageParam ?? null,
      }),

    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}

export function useDisputeStats(params: { userId?: string; workerId?: string } = {}) {
  return useQuery({
    queryKey: ['dispute-stats', params],
    queryFn: () => disputeService.getDisputeStats(params),
    staleTime: 1000 * 60 * 10,
  });
}
