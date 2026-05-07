import { BookingPaymentStatus, BookingStatus } from "@/constants";

import { Cursor } from "../common/query";

export type ListingStatus = BookingStatus | "all" | "upcoming";

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
