import { ADMIN_API } from '@/constants';
import api from '@/lib/api/axios';

const BookingManagementService = {
  addAdminNote: async (bookingId: string, note: string): Promise<{ message: string }> => {
    const res = await api.patch(ADMIN_API.BOOKING.BY_ID(bookingId), { note });
    return res.data;
  },
  cancelBooking: async (bookingId: string, reason: string): Promise<{ message: string }> => {
    const res = await api.patch(ADMIN_API.BOOKING.BY_ID(bookingId), { reason });
    return res.data;
  },
};

export default BookingManagementService;
