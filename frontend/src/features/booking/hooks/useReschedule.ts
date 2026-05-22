import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Role } from '@/constants';
import BookingService from '@/services/booking.service';

import { bookingKeys } from './useBooking';

import type { bookingRescheduleFormType } from '../validation/bookingRescheduleFormData';

export function useRequestReschedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string; data: bookingRescheduleFormType }) =>
      BookingService.requestReschedule(bookingId, data),
    onSuccess: (_, { bookingId }) => {
      qc.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      qc.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}

export function useRespondReschedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: { status: 'accepted' | 'rejected'; role: Role };
    }) => BookingService.respondReschedule(bookingId, data),
    onSuccess: (_, { bookingId }) => {
      qc.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      qc.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}

export function useCancelReschedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, requestedBy }: { bookingId: string; requestedBy: Role }) =>
      BookingService.cancelReschedule(bookingId, { requestedBy }),
    onSuccess: (_, { bookingId }) => {
      qc.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      qc.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}
