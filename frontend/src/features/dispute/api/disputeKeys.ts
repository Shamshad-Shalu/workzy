import type { DisputeListQuery } from '@/types/dispute';

export const disputeKeys = {
  all: ['disputes'] as const,
  lists: () => [...disputeKeys.all, 'list'] as const,
  list: (filters: Omit<DisputeListQuery, 'limit' | 'cursor'>) =>
    [...disputeKeys.lists(), filters] as const,
  stats: (params: { userId?: string; workerId?: string } = {}) =>
    [...disputeKeys.all, 'stats', params] as const,
  details: () => [...disputeKeys.all, 'detail'] as const,
  detail: (id: string | null | undefined) => [...disputeKeys.details(), id] as const,
};
