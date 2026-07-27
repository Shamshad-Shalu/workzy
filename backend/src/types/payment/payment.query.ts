import { BillType, PaymentStatus } from "@/constants";

import { Cursor } from "../common/query";

export interface PaymentListQuery {
  limit: number;
  search?: string;
  billType?: BillType | "all";
  cursor?: Cursor | null;
  status?: PaymentStatus | "all";
  userId?: string;
  workerId?: string;
  fromDate?: Date;
  toDate?: Date;
}
