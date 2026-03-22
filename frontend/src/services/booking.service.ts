import { BOOKING_API, PAYMENT_API } from '@/constants/apiRoutes/booking.routes';
import type { bookingFormData } from '@/features/user/booking/validation/bookingFormData';
import api from '@/lib/api/axios';
import type { BookingListParams, BookingResponse, PaymentDetails } from '@/types/booking';

const BookingService = {
  createBooking: async (data: bookingFormData): Promise<{ url: string }> => {
    const res = await api.post(BOOKING_API.ROOT, data);
    return res.data;
  },
  verifyPayment: async (sessionId: string): Promise<PaymentDetails> => {
    const res = await api.get(PAYMENT_API.VERIFY_BY_ID(sessionId));
    return res.data;
  },
  getBookings: async (params: BookingListParams): Promise<BookingResponse> => {
    const res = await api.get(BOOKING_API.ROOT, { params });
    return res.data;
  },
  cancelBooking: async (bookingId: string, reason: string): Promise<{ message: string }> => {
    const res = await api.patch(BOOKING_API.CANCEL(bookingId), {reason});
    return res.data;
  },
};

export default BookingService;
