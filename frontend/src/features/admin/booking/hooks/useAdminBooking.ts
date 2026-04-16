import { useInfiniteQuery } from '@tanstack/react-query';

import { bookingKeys } from '@/features/booking/hooks/useBooking';
import BookingService from '@/services/booking.service';
import type { AdminBookingListQuery, BookingListingResponse } from '@/types/booking';

const LIMIT = 5;

export function useAdminBookings(filters: Omit<AdminBookingListQuery, 'limit' | 'cursor'>) {
  const filterKey = JSON.stringify(filters);

  return useInfiniteQuery<
    BookingListingResponse,
    Error,
    { pages: BookingListingResponse[]; pageParams: (string | undefined)[] },
    ReturnType<typeof bookingKeys.admin>,
    string | undefined
  >({
    queryKey: bookingKeys.admin(filterKey),
    queryFn: ({ pageParam }) =>
      BookingService.getBookings({
        ...filters,
        limit: LIMIT,
        cursor: pageParam ?? null,
      }),
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}
