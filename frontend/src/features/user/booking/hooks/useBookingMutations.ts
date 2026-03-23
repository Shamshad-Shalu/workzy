import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import BookingService from '@/services/booking.service';

import { bookingKeys } from './useUserBookings';

export function useBookingMutations() {
  const queryClient = useQueryClient();

  const invalidateBookings = () => queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });

  const cancelBookingMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      BookingService.cancelBooking(id, reason),
    onSuccess: res => {
      toast.success(res.message);
      invalidateBookings();
    },
  });

  const disputeBookingMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      BookingService.disputeBooking(id, reason),
    onSuccess: res => {
      toast.success(res.message);
      invalidateBookings();
    },
  });

  const approveBookingMutation = useMutation({
    mutationFn: (id: string) => BookingService.approveBooking(id),
    onSuccess: res => {
      toast.success(res.message);
      invalidateBookings();
    },
  });

  const payExtraChargeMutation = useMutation({
    mutationFn: (id: string) => BookingService.payExtraCharge(id),
    onSuccess: res => {
      if (res.url) {
        window.location.href = res.url;
      }
    },
  });

  const rejectExtraChargeMutation = useMutation({
    mutationFn: (id: string) => BookingService.rejectExtraCharge(id),
    onSuccess: res => {
      toast.success(res.message);
      invalidateBookings();
    },
  });

  return {
    cancelBookingMutation,
    disputeBookingMutation,
    approveBookingMutation,
    payExtraChargeMutation,
    rejectExtraChargeMutation,
  };
}
