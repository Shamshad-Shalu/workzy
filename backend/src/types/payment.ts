import { Document, Types } from "mongoose";

import { BillType, PaymentProvider, PaymentStatus } from "@/constants";

export interface IPayment extends Document<string> {
  transactionId: string;
  title: string;
  userId: Types.ObjectId;
  workerId?: Types.ObjectId;
  billType: BillType;
  referenceId: Types.ObjectId;

  amount: number;
  platformFee?: number;
  workerAmount?: number;
  currency: string; // "inr" | "aed" | "usd"
  status: PaymentStatus;
  provider: PaymentProvider;
  paymentIntentId?: string;
  sessionId?: string;
  // idempotencyKey: string
  failureReason?: string;
  userName?: string;
  workerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingCheckoutParams {
  slotId: string;
  userId: string;
  workerId: string;
  workerStripeId: string;
  bookingId: string;
  amount: number;
  serviceName: string;
  workerName: string;
  userName: string;
  platformFee: number;
  workerAmount: number;
}

export interface VerifySessionType {
  success: boolean;
  transactionId?: string;
  productName?: string;
  amountPaid?: number;
  paymentMethod?: string;
  date?: string;
  type?: string;
  receiptUrl?: string;
}

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
