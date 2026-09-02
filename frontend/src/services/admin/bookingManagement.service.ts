import { ADMIN_API } from '@/constants';
import api from '@/lib/api/axios';
import type { ApiResponse } from '@/types/api';

const BookingManagementService = {
  addAdminNote: async (bookingId: string, note: string): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<null>>(ADMIN_API.BOOKING.BY_ID(bookingId), { note });
    return { message: res.data.message };
  },
  cancelBooking: async (bookingId: string, reason: string): Promise<{ message: string }> => {
    const res = await api.patch<ApiResponse<null>>(ADMIN_API.BOOKING.BY_ID(bookingId), { reason });
    return { message: res.data.message };
  },
};

export default BookingManagementService;
