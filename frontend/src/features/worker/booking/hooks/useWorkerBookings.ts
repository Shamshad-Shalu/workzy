import { useInfiniteQuery } from '@tanstack/react-query';

import type { BookingFilterStatus } from '@/constants';
import BookingService from '@/services/booking.service';
import { type BookingResponse } from '@/types/booking';

export const workerBookingKeys = {
  all: ['worker-bookings'] as const,
  lists: () => [...workerBookingKeys.all, 'list'] as const,
  list: (status: string) => [...workerBookingKeys.lists(), status] as const,
  detail: (id: string) => [...workerBookingKeys.all, 'detail', id] as const,
};

const LIMIT = 5;

export function useWorkerBookings(status: BookingFilterStatus) {
  return useInfiniteQuery<
    BookingResponse,
    Error,
    { pages: BookingResponse[]; pageParams: (string | undefined)[] },
    ReturnType<typeof workerBookingKeys.list>,
    string | undefined
  >({
    queryKey: workerBookingKeys.list(status),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      BookingService.getWorkerBookings({
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
