export const QUOTE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;
export type QuoteStatus = (typeof QUOTE_STATUS)[keyof typeof QUOTE_STATUS];
