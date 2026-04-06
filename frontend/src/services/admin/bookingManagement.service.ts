import { ADMIN_API } from '@/constants';
import api from '@/lib/api/axios';
import { type BookingCard, type AdminBookingListParams } from '@/types/booking';

const BookingManagementService = {
  getAllBookings: async (
    params: AdminBookingListParams
  ): Promise<{ bookings: BookingCard[]; total: number }> => {
    const res = await api.get(ADMIN_API.BOOKING.ROOT, { params });
    return res.data;
  },
};

export default BookingManagementService;
