import { BaseRepository } from "@/core/abstracts/base.repository";
import {
  AdminBookingListParams,
  BookingCardEntity,
  BookingDetailsEntity,
  BookingListParams,
  IBooking,
  PaginatedBookingsEntity,
} from "@/types/booking";

export interface IBookingRepository extends BaseRepository<IBooking> {
  getBookingDetailById(bookingId: string): Promise<BookingDetailsEntity | null>;

  getUserBookings(userId: string, query: BookingListParams): Promise<PaginatedBookingsEntity>;
  getWorkerBookings(workerId: string, query: BookingListParams): Promise<PaginatedBookingsEntity>;
  getAllBookings(
    query: AdminBookingListParams
  ): Promise<{ bookings: BookingCardEntity[]; total: number }>;
}
