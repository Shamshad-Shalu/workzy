import { useQuery } from '@tanstack/react-query';

import { disputeService } from '@/services/dispute.service';
import type { Dispute } from '@/types/dispute';

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
