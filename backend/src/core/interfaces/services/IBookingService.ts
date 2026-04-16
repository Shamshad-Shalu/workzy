import { CompleteBookingDTO, CreatebookingDTO, ExtraChargeDTO } from "@/dtos/requests/booking.dto";
import { BookingListItemDTO, BookingResponseDTO } from "@/dtos/responses/booking.dto";
import { BookingListQuery } from "@/types/booking";

export interface IBookingService {
  getBookings(
    input: BookingListQuery
  ): Promise<{ bookings: BookingListItemDTO[]; nextCursor: string | null }>;
  getBookingDetails(bookingId: string): Promise<BookingResponseDTO>;

  createBooking(userId: string, data: CreatebookingDTO): Promise<{ url: string }>;
  cancelBooking(bookingId: string, userId: string, reason: string): Promise<void>;
  acceptBooking(bookingId: string, workerId: string): Promise<void>;
  markEnRoute(bookingId: string, workerId: string): Promise<void>;
  markReached(bookingId: string, workerId: string): Promise<void>;
  startJob(bookingId: string, workerId: string, otp: string): Promise<void>;
  rejectBooking(data: { bookingId: string; workerId: string; reason: string }): Promise<void>;
  completeJob(bookingId: string, workerId: string, data: CompleteBookingDTO): Promise<void>;
  requestExtraCharge(bookingId: string, workerId: string, data: ExtraChargeDTO): Promise<void>;
  approveBooking(bookingId: string, userId: string): Promise<void>;
  payExtraCharge(bookingId: string, userId: string): Promise<{ url: string }>;
  rejectExtraCharge(bookingId: string, userId: string): Promise<void>;
}
