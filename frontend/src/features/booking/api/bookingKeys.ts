import type { BookingListQuery } from '@/types/booking';

export const bookingKeys = {
  all: ['bookings'] as const,
  lists: (filters?: Omit<BookingListQuery, 'limit' | 'cursor'>) =>
    [...bookingKeys.all, 'list', filters] as const,
};
