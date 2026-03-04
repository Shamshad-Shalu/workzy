import type { BillingCycle, SubscriptionStatus } from '@/constants';

import type { Plan } from './plan';

export interface Subscription {
  id: string;
  workerId: string;
  planId: string;
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
  createdAt?: Date;
}

export type SubscriptionInfo = Omit<Subscription, 'cancelReason'> &
  Pick<Plan, 'name' | 'description' | 'price' | 'isSpecialOffer'>;
