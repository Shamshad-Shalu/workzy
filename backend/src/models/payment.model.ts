import mongoose, { Schema } from "mongoose";

import { BILL_TYPE, PAYMENT_PROVIDER, PAYMENT_STATUS } from "@/constants";
import { IPayment } from "@/types/payment";

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    billType: { type: String, required: true, enum: Object.values(BILL_TYPE) },
    referenceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "inr" },
    status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },
    provider: {
      type: String,
      enum: Object.values(PAYMENT_PROVIDER),
      default: PAYMENT_PROVIDER.STRIPE,
    },
    paymentIntentId: { type: String, sparse: true, unique: true },
    sessionId: { type: String, sparse: true, unique: true },
    failureReason: { type: String, default: undefined },
  },
  { timestamps: true }
);

PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ referenceId: 1 });
PaymentSchema.index({ billType: 1, status: 1 });

const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
export default Payment;
