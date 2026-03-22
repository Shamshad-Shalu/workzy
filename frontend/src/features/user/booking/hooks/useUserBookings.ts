import { useInfiniteQuery } from '@tanstack/react-query';

import type { BookingFilterStatus } from '@/constants';
import BookingService from '@/services/booking.service';
import { type BookingResponse } from '@/types/booking';

export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (status: string) => [...bookingKeys.lists(), status] as const,
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
};

const LIMIT = 5;

export function useUserBookings(status: BookingFilterStatus) {
  return useInfiniteQuery<
    BookingResponse,
    Error,
    { pages: BookingResponse[]; pageParams: (string | undefined)[] },
    ReturnType<typeof bookingKeys.list>,
    string | undefined
  >({
    queryKey: bookingKeys.list(status),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      BookingService.getUserBookings({
        status,
        limit: LIMIT,
        cursor: pageParam,
        sort: status === 'upcoming' ? 'asc' : 'desc',
      }),
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.cursor ?? undefined,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  });
}
