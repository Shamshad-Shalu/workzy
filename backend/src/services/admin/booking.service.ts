import { inject, injectable } from "inversify";

import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import { IAdminBookingService } from "@/core/interfaces/services/admin/IAdminBookingService";
import { IS3Service } from "@/core/interfaces/services/IS3Service";
import { TYPES } from "@/di/types";
import { BookingCardResponseDTO } from "@/dtos/responses/booking.dto";
import { AdminBookingListParams } from "@/types/booking";

@injectable()
export class AdminBookingService implements IAdminBookingService {
  constructor(
    @inject(TYPES.BookingRepository) private _bookingRepository: IBookingRepository,
    @inject(TYPES.S3Service) private _s3Service: IS3Service
  ) {}

  async getAllBookings(
    query: AdminBookingListParams
  ): Promise<{ bookings: BookingCardResponseDTO[]; total: number }> {
    const { bookings, total } = await this._bookingRepository.getAllBookings(query);
    return {
      bookings: await BookingCardResponseDTO.fromEntities(bookings, this._s3Service),
      total,
    };
  }
}
