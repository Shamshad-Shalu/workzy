export const BILL_TYPE = {
  SUBSCRIPTION: "subscription",
  BOOKING: "booking",
  EXTRA_CHARGE: "extra_charge",
  REFUND: "refund",
} as const;
export type BillType = (typeof BILL_TYPE)[keyof typeof BILL_TYPE];

export const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
} as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const PAYMENT_PROVIDER = {
  STRIPE: "stripe",
} as const;
export type PaymentProvider = (typeof PAYMENT_PROVIDER)[keyof typeof PAYMENT_PROVIDER];

export const STRIPE_ACCOUNT_STATUS = {
  NOT_CONNECTED: "not_connected",
  PENDING: "pending",
  ACTIVE: "active",
} as const;
export type StripeAccountStatus =
  (typeof STRIPE_ACCOUNT_STATUS)[keyof typeof STRIPE_ACCOUNT_STATUS];

export const WALLET_STATUS = {
  PENDING: "pending",
  AVAILABLE: "available",
  FROZEN: "frozen",
} as const;

export type WalletStatus = (typeof WALLET_STATUS)[keyof typeof WALLET_STATUS];
