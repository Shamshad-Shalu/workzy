import { BillType, PaymentStatus } from "@/constants";

export interface PaymentListQueryInput {
  limit: number;
  cursor?: {
    createdAt: string;
    id: string;
  };
  billType?: BillType | "all";
  status?: PaymentStatus | "all";
  userId?: string;
  workerId?: string;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface PaymentListQuery
  extends Omit<PaymentListQueryInput, "cursor" | "fromDate" | "toDate"> {
  cursor?: {
    createdAt: Date;
    _id: string;
  };
  fromDate?: Date;
  toDate?: Date;
}
