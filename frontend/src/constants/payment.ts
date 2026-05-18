export const BILL_TYPE = {
  BOOKING: 'booking',
  EXTRA_CHARGE: 'extra_charge',
  REFUND: 'refund',
} as const;
export type BillType = (typeof BILL_TYPE)[keyof typeof BILL_TYPE];

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  RELEASED: 'released',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled',
} as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export type BadgeVariant = 'green' | 'blue' | 'amber' | 'red' | 'slate' | 'secondary';

export const PAYMENT_STATUS_CONFIG: Record<string, { label: string; variant: BadgeVariant }> = {
  succeeded: { label: 'Succeeded', variant: 'green' },
  released: { label: 'Released', variant: 'blue' },
  pending: { label: 'Pending', variant: 'amber' },
  failed: { label: 'Failed', variant: 'red' },
  refunded: { label: 'Refunded', variant: 'slate' },
  cancelled: { label: 'Cancelled', variant: 'secondary' },
};

export const PAYMENT_BILL_TYPE_CONFIG: Record<string, { label: string; variant: BadgeVariant }> = {
  booking: { label: 'Booking', variant: 'green' },
  extra_charge: { label: 'Extra Charge', variant: 'amber' },
  refund: { label: 'Refund', variant: 'red' },
};
