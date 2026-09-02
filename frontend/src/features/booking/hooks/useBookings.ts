import { useInfiniteQuery } from '@tanstack/react-query';

import BookingService from '@/services/booking.service';
import type { BookingListingResponse, BookingListQuery } from '@/types/booking';

import { bookingKeys } from '../index.ts';

const LIMIT = 5;

export function useBookings(filters?: Omit<BookingListQuery, 'limit' | 'cursor'>) {
  return useInfiniteQuery<
    BookingListingResponse,
    Error,
    { pages: BookingListingResponse[]; pageParams: (string | undefined)[] },
    ReturnType<typeof bookingKeys.lists>,
    string | undefined
  >({
    queryKey: bookingKeys.lists(filters),
    queryFn: ({ pageParam }) =>
      BookingService.getBookings({
        ...filters,
        limit: LIMIT,
        cursor: pageParam ?? null,
      }),
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    gcTime: 1000 * 60 * 5,
    staleTime: 0,
  });
}
