import { BookingPaymentStatus, BookingStatus } from "@/constants";

export type ListingStatus = BookingStatus | "all" | "upcoming";

export interface Cursor {
  createdAt: string;
  _id: string;
}

export interface BookingListQuery {
  status: ListingStatus;
  paymentStatus?: BookingPaymentStatus | "all";
  userId?: string;
  workerId?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  limit: number;
  cursor?: Cursor | null;
}
