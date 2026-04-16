import { useMutation, useQueryClient } from '@tanstack/react-query';

import BookingService from '@/services/booking.service';

export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  user: (status: string) => [...bookingKeys.lists(), 'user', status] as const,
  worker: (status: string) => [...bookingKeys.lists(), 'worker', status] as const,
  admin: (filters: string) => [...bookingKeys.lists(), 'admin', filters] as const,
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
};

export function useAcceptBooking() {
  const qc = useQueryClient();
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id: string) => BookingService.acceptBooking(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}

type CancelBookingPayload = {
  id: string;
  reason: string;
};

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: CancelBookingPayload) => BookingService.cancelBooking(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookingKeys.lists() }),
  });
}

export function useApproveBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BookingService.approveBooking(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookingKeys.lists() }),
  });
}

export function usePayExtraCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BookingService.payExtraCharge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: bookingKeys.lists() }),
  });
}
