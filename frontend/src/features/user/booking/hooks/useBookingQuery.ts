import { useMutation } from '@tanstack/react-query';

import BookingService from '@/services/booking.service';

import type { bookingFormData } from '../validation/bookingFormData';

export function useCreateBooking() {
  return useMutation({
    mutationFn: (data: bookingFormData) => BookingService.createBooking(data),
    onSuccess: ({ url }) => {
      setTimeout(() => {
        window.location.href = url;
      }, 100);
    },
  });
}
