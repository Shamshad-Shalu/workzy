import { BaseRepository } from "@/core/abstracts/base.repository";
import {
  BookingDetailsEntity,
  BookingListParams,
  IBooking,
  PaginatedBookingsEntity,
} from "@/types/booking";

export interface IBookingRepository extends BaseRepository<IBooking> {
  getUserBookings(userId: string, query: BookingListParams): Promise<PaginatedBookingsEntity>;
  getBookingDetailById(bookingId: string): Promise<BookingDetailsEntity | null>;
}
