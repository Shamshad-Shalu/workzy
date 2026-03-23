import { Document, Types } from "mongoose";

import { BillingCycle, SubscriptionStatus } from "@/constants";

import { IPlan } from "./plan";

export interface ISubscription extends Document<string> {
  workerId: Types.ObjectId;
  planId: Types.ObjectId;
  billingCycle: BillingCycle;
  amountPaid: number;
  status: SubscriptionStatus;
  startDate: Date;
  expiryDate: Date;
  // autoRenew: boolean;
  // stripeSubscriptionId?: string;
  // stripeCustomerId?: string;

  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionInfoEntity = Omit<
  ISubscription,
  "stripeSubscriptionId" | "stripeCustomerId" | "cancelReason" | "planId"
> & {
  planId: Pick<IPlan, "_id" | "name" | "description" | "price" | "isSpecialOffer">;
};

export interface AddSubscriptionDto {
  name: string;
  workerId: string;
  userId: string;
  subscriptionId: string;
  amount: number;
}

export interface AdminSubscriptionListEntity {
  _id: string;
  worker: {
    _id: string;
    displayName: string;
    profileImage?: string;
    email: string;
  };
  plan: {
    _id: string;
    name: string;
    isSpecialOffer: boolean;
  };
  billingCycle: BillingCycle;
  amountPaid: number;
  status: SubscriptionStatus;
  startDate: Date;
  expiryDate: Date;
  cancelledAt?: Date;
  createdAt: Date;
}
