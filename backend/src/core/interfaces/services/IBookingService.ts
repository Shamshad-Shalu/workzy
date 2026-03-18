import { CreatebookingDTO } from "@/dtos/requests/booking.dto";

export interface IBookingService {
  createBooking(userId: string, data: CreatebookingDTO): Promise<{ url: string }>;
}
