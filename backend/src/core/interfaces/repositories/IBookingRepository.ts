import { BaseRepository } from "@/core/abstracts/base.repository";
import { IBooking } from "@/types/booking/booking.entity";
import { BookingDetails, BookingListItem } from "@/types/booking/booking.projection";
import { BookingListQuery } from "@/types/booking/booking.query";
import { CursorPaginatedResult } from "@/types/common/pagination";

export interface IBookingRepository extends BaseRepository<IBooking> {
  getBookings(input: BookingListQuery): Promise<CursorPaginatedResult<BookingListItem>>;
  getExpiredBookings(): Promise<IBooking[]>;
  getBookingDetailById(bookingId: string): Promise<BookingDetails | null>;
}
