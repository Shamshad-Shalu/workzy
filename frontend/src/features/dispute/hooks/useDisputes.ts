import { useInfiniteQuery } from '@tanstack/react-query';

import { disputeService } from '@/services/dispute.service';
import type { DisputeListQuery } from '@/types/dispute';

import { disputeKeys } from '../index';

const LIMIT = 5;

export function useDisputes(filters: Omit<DisputeListQuery, 'limit' | 'cursor'>) {
  return useInfiniteQuery({
    queryKey: disputeKeys.list(filters),
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
