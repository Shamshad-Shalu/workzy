import { useQuery } from '@tanstack/react-query';

import { disputeService } from '@/services/dispute.service';
import type { Dispute } from '@/types/dispute';

import { disputeKeys } from '../index';

export function useDisputeDetails(bookingId?: string | null) {
  const query = useQuery<Dispute | null>({
    queryKey: disputeKeys.detail(bookingId),
    queryFn: async () => {
      if (!bookingId) {
        throw new Error('Booking ID is required');
      }
      return await disputeService.getDisputeByBookingId(bookingId);
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
