import mongoose, { Schema } from "mongoose";

import { BILL_TYPE, PAYMENT_PROVIDER, PAYMENT_STATUS } from "@/constants";
import { IPayment } from "@/types/payment/payment.entity";

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workerId: { type: Schema.Types.ObjectId, ref: "Worker", default: null, index: true },
    billType: { type: String, required: true, enum: Object.values(BILL_TYPE) },
    bookingId: {
      type: Schema.Types.ObjectId,
      index: true,
      required: true,
    },
    amount: { type: Number, required: true },
    platformFee: {
      type: Number,
      default: null,
    },
    workerAmount: {
      type: Number,
      default: null,
    },
    currency: { type: String, default: "inr" },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      index: true,
    },
    provider: {
      type: String,
      enum: Object.values(PAYMENT_PROVIDER),
      default: PAYMENT_PROVIDER.STRIPE,
    },
    paymentIntentId: { type: String, sparse: true, unique: true },
    sessionId: { type: String, sparse: true, unique: true },
    userName: { type: String },
    workerName: { type: String },
    failureReason: { type: String },
  },
  { timestamps: true }
);

PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ workerId: 1, createdAt: -1 });
PaymentSchema.index({ billType: 1, status: 1 });
PaymentSchema.index({ status: 1, createdAt: -1 });

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
export default Payment;
