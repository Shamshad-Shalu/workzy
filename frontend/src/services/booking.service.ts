import { BOOKING_API, PAYMENT_API } from '@/constants/apiRoutes/booking.routes';
import type { bookingFormData } from '@/features/user/booking/validation/bookingFormData';
import api from '@/lib/api/axios';
import type { PaymentDetails } from '@/types/booking';

const BookingService = {
  createBooking: async (data: bookingFormData): Promise<{ url: string }> => {
    const res = await api.post(BOOKING_API.ROOT, data);
    return res.data;
  },
  verifyPayment : async (sessionId:string) : Promise<PaymentDetails> => {
    const res = await api.get(PAYMENT_API.VERIFY_BY_ID(sessionId));
    return res.data;
  }
};

export default BookingService;
