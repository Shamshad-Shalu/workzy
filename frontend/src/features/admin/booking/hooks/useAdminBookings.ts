import { useQuery } from '@tanstack/react-query';

import BookingManagementService from '@/services/admin/bookingManagement.service';
import type { AdminBookingListParams } from '@/types/booking';

export const useAdminBookings = ({
  status,
  paymentStatus,
  page,
  limit,
  search,
}: AdminBookingListParams) => {
  return useQuery({
    queryKey: ['adminBookings', { status, paymentStatus, page, limit, search }],
    queryFn: () =>
      BookingManagementService.getAllBookings({ limit, page, paymentStatus, search, status }),
  });
};
