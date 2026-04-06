import { BookingCardResponseDTO } from "@/dtos/responses/booking.dto";
import { AdminBookingListParams } from "@/types/booking";

export interface IAdminBookingService {
  getAllBookings(
    query: AdminBookingListParams
  ): Promise<{ bookings: BookingCardResponseDTO[]; total: number }>;
}
