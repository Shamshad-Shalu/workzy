import { useQuery } from '@tanstack/react-query';

import BookingService from '@/services/booking.service';
import type { BookingDetails } from '@/types/booking';

export function useBookingDetails(bookingId: string | null) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId) {
        return null;
      }
      const res = await BookingService.getBookingDetails(bookingId);
      return res.data as BookingDetails;
    },
    enabled: !!bookingId,
  });
}
