import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Role } from '@/constants';
import { disputeService } from '@/services/dispute.service';
import type { Dispute, DisputeListQuery } from '@/types/dispute';

import type { DisputeFormType } from '../validation/disputeFormData';

const LIMIT = 5;

export function useDisputes(filters: Omit<DisputeListQuery, 'limit' | 'cursor'>) {
  return useInfiniteQuery({
    queryKey: ['disputes', filters.reason, filters.search, filters.status, filters.role] as const,
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

export function useDisputeDetails(bookingId?: string | null) {
  const query = useQuery<Dispute | null>({
    queryKey: ['dispute-details', bookingId],
    queryFn: async () => {
      if (!bookingId) {
        throw new Error('Booking ID is required');
      }
      const res = await disputeService.getDisputeByBookingId(bookingId);
      return res;
    },
    enabled: !!bookingId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    dispute: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useDisputeStats(role: Role) {
  return useQuery({
    queryKey: ['dispute-stats'],
    queryFn: () => disputeService.getDisputeStats(role),
    staleTime: 1000 * 60 * 10,
  });
}

export function useRaiseDispute() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, { bookingId: string; data: DisputeFormType }>({
    mutationFn: ({ bookingId, data }) => disputeService.raiseDispute(bookingId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dispute-details'] });
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['dispute-stats'] });
    },
  });
}

export function useUpdateDispute() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, { disputeId: string; data: DisputeFormType }>({
    mutationFn: ({ disputeId, data }) => disputeService.updateDispute(disputeId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dispute-details'] });
      qc.invalidateQueries({ queryKey: ['disputes'] });
      qc.invalidateQueries({ queryKey: ['dispute-stats'] });
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
