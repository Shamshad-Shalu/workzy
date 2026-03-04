import { Document, Types } from "mongoose";

import { BillType, PaymentProvider, PaymentStatus } from "@/constants";

export interface IPayment extends Document<string> {
  userId: Types.ObjectId;
  transactionId: string;
  billType: BillType;
  referenceId: Types.ObjectId;
  amount: number;
  currency: string; // "inr" | "aed" | "usd"
  platformFee: number;
  netAmount: number;
  status: PaymentStatus;
  provider: PaymentProvider;
  paymentIntentId: string;
  stripeCheckoutSessionId?: string;
  // idempotencyKey: string
  failureReason: string;
  createdAt: Date;
  updatedAt: Date;
}
