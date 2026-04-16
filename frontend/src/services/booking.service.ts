import { BOOKING_API, PAYMENT_API } from '@/constants/apiRoutes/booking.routes';
import type { bookingFormData } from '@/features/user/booking/validation/bookingFormData';
import type { BookigCompleteForm } from '@/features/worker/booking/components/WorkerCompleteModal';
import type { ExtraChargeFormType } from '@/features/worker/booking/validation/extraChargeSchema';
import api from '@/lib/api/axios';
import type {
  AdminBookingListQuery,
  BookingDetails,
  BookingListingResponse,
  BookingListQuery,
  PaymentDetails,
} from '@/types/booking';

const BookingService = {
  getBookings: async (params: AdminBookingListQuery): Promise<BookingListingResponse> => {
    const res = await api.get(BOOKING_API.ROOT, { params });
    return res.data;
  },
  getUserBookings: async (params: BookingListQuery): Promise<BookingListingResponse> => {
    const res = await api.get(BOOKING_API.BY_USER, { params });
    console.log('data::', res.data);
    return res.data;
  },
  getWorkerBookings: async (params: BookingListQuery): Promise<BookingListingResponse> => {
    const res = await api.get(BOOKING_API.BY_WORKER, { params });
    return res.data;
  },
  getBookingDetails: async (bookingId: string): Promise<{ booking: BookingDetails }> => {
    const res = await api.get(BOOKING_API.BY_ID(bookingId));
    return res.data;
  },
  createBooking: async (data: bookingFormData): Promise<{ url: string }> => {
    const res = await api.post(BOOKING_API.ROOT, data);
    return res.data;
  },
  acceptBooking: async (bookingId: string): Promise<{ message: string }> => {
    const res = await api.patch(BOOKING_API.ACCEPT(bookingId));
    return res.data;
  },
  verifyPayment: async (sessionId: string): Promise<PaymentDetails> => {
    const res = await api.get(PAYMENT_API.VERIFY_BY_ID(sessionId));
    return res.data;
  },
  cancelBooking: async (bookingId: string, reason: string): Promise<{ message: string }> => {
    const res = await api.patch(BOOKING_API.CANCEL(bookingId), { reason });
    return res.data;
  },

  rejectBooking: async (bookingId: string, reason: string): Promise<{ message: string }> => {
    const res = await api.patch(BOOKING_API.REJECT(bookingId), { reason });
    return res.data;
  },
  startJob: async ({
    bookingId,
    otp,
  }: {
    bookingId: string;
    otp: string;
  }): Promise<{ message: string }> => {
    const res = await api.patch(BOOKING_API.START(bookingId), { otp });
    return res.data;
  },
  completeJob: async (
    bookingId: string,
    data: BookigCompleteForm
  ): Promise<{ message: string }> => {
    const res = await api.patch(BOOKING_API.COMPLETE(bookingId), data);
    return res.data;
  },
  approveBooking: async (bookingId: string): Promise<{ message: string }> => {
    const res = await api.patch(BOOKING_API.APPROVE(bookingId));
    return res.data;
  },
  markEnRoute: async (bookingId: string): Promise<{ message: string }> => {
    const res = await api.patch(BOOKING_API.EN_ROUTE(bookingId));
    return res.data;
  },
  markReached: async (bookingId: string): Promise<{ message: string }> => {
    const res = await api.patch(BOOKING_API.MARK_REACHED(bookingId));
    return res.data;
  },
  payExtraCharge: async (bookingId: string): Promise<{ url: string }> => {
    const res = await api.patch(BOOKING_API.EXTRA_CHARGE_PAY(bookingId));
    return res.data;
  },
  rejectExtraCharge: async (bookingId: string): Promise<{ message: string }> => {
    const res = await api.patch(BOOKING_API.EXTRA_CHARGE_REJECT(bookingId));
    return res.data;
  },
  requestExtraCharge: async (
    bookingId: string,
    data: ExtraChargeFormType
  ): Promise<{ message: string }> => {
    const res = await api.patch(BOOKING_API.EXTRA_CHARGE(bookingId), data);
    return res.data;
  },
  disputeBooking: async (bookingId: string, reason: string): Promise<{ message: string }> => {
    const res = await api.patch(BOOKING_API.DISPUTE(bookingId), { reason });
    return res.data;
  },
};

export default BookingService;
