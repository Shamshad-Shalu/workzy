import { CreatebookingDTO } from "@/dtos/requests/booking.dto";
import { BookingResponseDTO, PaginatedBookingsDTO } from "@/dtos/responses/booking.dto";
import { BookingListParams } from "@/types/booking";

export interface IBookingService {
  createBooking(userId: string, data: CreatebookingDTO): Promise<{ url: string }>;
  getUserBookings(userId: string, query: BookingListParams): Promise<PaginatedBookingsDTO>;
  cancelBooking(bookingId: string, userId: string, reason: string): Promise<void>;
  getBookingDetails(bookingId: string): Promise<BookingResponseDTO>;
}
