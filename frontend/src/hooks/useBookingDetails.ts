import { useQuery } from '@tanstack/react-query';

import { bookingKeys } from '@/features/booking/hooks/useBooking';
import { ApiError } from '@/lib/api/apiError';
import BookingService from '@/services/booking.service';
import type { BookingDetails } from '@/types/booking';

export function useBookingDetails(bookingId?: string | null) {
  const query = useQuery<BookingDetails, ApiError>({
    queryKey: bookingKeys.detail(bookingId!),
    queryFn: async () => {
      const res = await BookingService.getBookingDetails(bookingId!);
      return res.booking;
    },
    enabled: !!bookingId,
    staleTime: 0,
    refetchInterval: 10000,
    retry: 1,
  });

  return {
    booking: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
