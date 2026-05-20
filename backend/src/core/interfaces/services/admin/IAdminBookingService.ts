import { AdminCancelDTO, AdminNoteDTO } from "@/dtos/requests/admin/booking.dto";

export interface IAdminBookingService {
  adminCancelBooking(bookingId: string, data: AdminCancelDTO): Promise<void>;
  addAdminNote(bookingId: string, data: AdminNoteDTO): Promise<void>;
}
