import { Document, Types } from "mongoose";

import { BillType, PaymentProvider, PaymentStatus } from "@/constants";

export interface IPayment extends Document<string> {
  transactionId: string;
  userId: Types.ObjectId;
  billType: BillType;
  referenceId: Types.ObjectId;

  amount: number;
  currency: string; // "inr" | "aed" | "usd"
  status: PaymentStatus;
  provider: PaymentProvider;
  paymentIntentId?: string;
  sessionId?: string;
  // idempotencyKey: string
  failureReason: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingCheckoutParams {
  userId: string;
  workerStripeId: string;
  bookingId: string;
  slotId: string;
  amount: number;
  serviceName: string;
  platformFee: number;
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
