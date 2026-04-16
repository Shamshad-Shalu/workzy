import {
  AdminCancelDTO,
  AdminNoteDTO,
  AdminRefundDTO,
  ResolveDisputeDTO,
} from "@/dtos/requests/admin/booking.dto";

export interface IAdminBookingService {
  resolveDispute(bookingId: string, data: ResolveDisputeDTO): Promise<{ message: string }>;
  adminCancelBooking(bookingId: string, data: AdminCancelDTO): Promise<void>;
  addAdminNote(bookingId: string, data: AdminNoteDTO): Promise<void>;
  adminRefund(bookingId: string, data: AdminRefundDTO): Promise<void>;
}
