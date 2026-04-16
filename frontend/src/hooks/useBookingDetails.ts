import { useQuery } from '@tanstack/react-query';

import BookingService from '@/services/booking.service';
import type { BookingDetails } from '@/types/booking';

export function useBookingDetails(bookingId: string | null) {
  const query = useQuery<BookingDetails>({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const res = await BookingService.getBookingDetails(bookingId!);
      return res.booking;
    },
    enabled: !!bookingId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    booking: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
