import { Document, Types } from "mongoose";

import { BillingCycle, SubscriptionStatus } from "@/constants";

export interface ISubscription extends Document {
  workerId: Types.ObjectId;
  planId: Types.ObjectId;
  billingCycle: BillingCycle;
  amountPaid: number;
  status: SubscriptionStatus;
  startDate: Date;
  expiryDate: Date;
  autoRenew: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
