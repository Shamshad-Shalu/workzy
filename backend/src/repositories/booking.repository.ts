import { BaseRepository } from "@/core/abstracts/base.repository";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import Booking from "@/models/booking.model";
import { IBooking } from "@/types/booking";

export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
  constructor() {
    super(Booking);
  }
}
