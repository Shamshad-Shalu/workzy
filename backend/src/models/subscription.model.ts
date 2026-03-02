import mongoose, { Schema } from "mongoose";

import { BILLING_CYCLE, SUBSCRIPTION_STATUS } from "@/constants";
import { ISubscription } from "@/types/subscription";

const SubscriptionSchema: Schema<ISubscription> = new Schema(
  {
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    billingCycle: {
      type: String,
      enum: Object.values(BILLING_CYCLE),
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: SUBSCRIPTION_STATUS.ACTIVE,
    },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true },
    stripeSubscriptionId: {
      type: String,
      default: undefined,
    },
    stripeCustomerId: { type: String, default: undefined },
    cancelledAt: { type: Date, default: undefined },
    cancelReason: { type: String, default: undefined },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ workerId: 1, status: 1 });
SubscriptionSchema.index({ status: 1, expiryDate: 1 });
SubscriptionSchema.index({ workerId: 1, createdAt: -1 });
SubscriptionSchema.index({ planId: 1, status: 1 });

export default mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
