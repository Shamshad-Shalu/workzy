export const BILLING_CYCLE = {
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
  HALF_YEARLY: "halfYearly",
  YEARLY: "yearly",
} as const;

export type BillingCycle = (typeof BILLING_CYCLE)[keyof typeof BILLING_CYCLE];

export const BILLING_CYCLE_MONTHS: Record<BillingCycle, number> = {
  monthly: 1,
  quarterly: 3,
  halfYearly: 6,
  yearly: 12,
};

export const SUBSCRIPTION_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
} as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export const PREMIUM_BENEFITS = [
  "Priority in Search Results",
  "Verified Premium Badge",
  "Detailed Analytics Dashboard",
  "Priority Support from Admin",
  "First Priority for Cancelled Job Reassignment",
  "Early Access to New Features",
] as const;

export const SUBSCRIPTION_EXPIRY_CRON = "0 0 * * *";
