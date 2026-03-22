import { CompleteBookingDTO, CreatebookingDTO, ExtraChargeDTO } from "@/dtos/requests/booking.dto";
import { BookingResponseDTO, PaginatedBookingsDTO } from "@/dtos/responses/booking.dto";
import { BookingListParams } from "@/types/booking";

export interface IBookingService {
  createBooking(userId: string, data: CreatebookingDTO): Promise<{ url: string }>;
  getUserBookings(userId: string, query: BookingListParams): Promise<PaginatedBookingsDTO>;
  getWorkerBookings(workerId: string, query: BookingListParams): Promise<PaginatedBookingsDTO>;
  cancelBooking(bookingId: string, userId: string, reason: string): Promise<void>;
  getBookingDetails(bookingId: string): Promise<BookingResponseDTO>;
  acceptBooking(bookingId: string, workerId: string): Promise<void>;
  startJob(bookingId: string, workerId: string): Promise<void>;
  rejectBooking(data: { bookingId: string; workerId: string; reason: string }): Promise<void>;
  completeJob(bookingId: string, workerId: string, data: CompleteBookingDTO): Promise<void>;
  requestExtraCharge(bookingId: string, workerId: string, data: ExtraChargeDTO): Promise<void>;
  approveBooking(bookingId: string, userId: string): Promise<void>;
  payExtraCharge(bookingId: string, userId: string): Promise<{ url: string }>;
  rejectExtraCharge(bookingId: string, userId: string): Promise<void>;
}
