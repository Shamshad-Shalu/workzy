import { BaseRepository } from "@/core/abstracts/base.repository";
import { BookingListItem, BookingListQuery, IBooking } from "@/types/booking";

export interface IBookingRepository extends BaseRepository<IBooking> {
  getBookings(
    input: BookingListQuery
  ): Promise<{ bookings: BookingListItem[]; nextCursor: string | null }>;
  // getBookingDetailById(bookingId: string): Promise<BookingDetails | null>;
}
