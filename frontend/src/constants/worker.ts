export const STRIPE_ACCOUNT_STATUS = {
  NOT_CONNECTED: 'not_connected',
  PENDING: 'pending',
  ACTIVE: 'active',
} as const;
export type StripeAccountStatus =
  (typeof STRIPE_ACCOUNT_STATUS)[keyof typeof STRIPE_ACCOUNT_STATUS];

export const WORKER_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  NEEDS_REVISION: 'needs_revision',
  SUSPENDED: 'suspended',
} as const;
export type WorkerStatus = (typeof WORKER_STATUS)[keyof typeof WORKER_STATUS];
