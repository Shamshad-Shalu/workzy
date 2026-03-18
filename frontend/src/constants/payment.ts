export const STRIPE_ACCOUNT_STATUS = {
  NOT_CONNECTED: 'not_connected',
  PENDING: 'pending',
  ACTIVE: 'active',
} as const;
export type StripeAccountStatus =
  (typeof STRIPE_ACCOUNT_STATUS)[keyof typeof STRIPE_ACCOUNT_STATUS];
