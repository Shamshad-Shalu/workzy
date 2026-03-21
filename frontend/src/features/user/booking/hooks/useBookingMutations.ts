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

  return {
    cancelBookingMutation,
  };
}
