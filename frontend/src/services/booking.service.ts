import { BOOKING_API } from '@/constants/apiRoutes/booking.routes';
import type { bookingFormData } from '@/features/user/booking/validation/bookingFormData';
import api from '@/lib/api/axios';

const BookingService = {
  createBooking: async (data: bookingFormData): Promise<{ url: string }> => {
    console.log('data::', data);
    const res = await api.post(BOOKING_API.ROOT, data);
    return res.data;
  },
};

export default BookingService;
