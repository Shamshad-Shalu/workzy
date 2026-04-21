export const BOOKING_STATUS = {
  PENDING: "pending", // payment success, worker notified
  CONFIRMED: "confirmed", //worker accepted
  EN_ROUTE: "en_route", // worker heading to location ✦ from friend
  REACHED: "reached", // worker arrived
  IN_PROGRESS: "in_progress", // worker started job
  COMPLETED: "completed", // job finished
  APPROVED: "approved", // user approved
  CANCELLED: "cancelled", // cancelled before start
  REJECTED: "rejected", // worker rejected
  DISPUTED: "disputed", // user raised dispute
  EXPIRED: "expired",
} as const;

export const BOOKING_STATUS_VALUES = Object.values(BOOKING_STATUS);
export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const BOOKING_PAYMENT_STATUS = {
  PENDING: "pending",
  HELD: "held",
  RELEASED: "released",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
  FAILED: "failed",
} as const;

export const BOOKING_PAYMENT_STATUS_VALUES = Object.values(BOOKING_PAYMENT_STATUS);

export type BookingPaymentStatus =
  (typeof BOOKING_PAYMENT_STATUS)[keyof typeof BOOKING_PAYMENT_STATUS];

export const SLOT_STATUS = {
  RESERVED: "reserved",
  BOOKED: "booked",
} as const;
export const SLOT_STATUS_VALUES = Object.values(SLOT_STATUS);

export type SlotStatus = (typeof SLOT_STATUS)[keyof typeof SLOT_STATUS];

export const QUOTE_STATUS = {
  PENDING: "pending",
  REJECTED: "rejected",
  ACCEPETED: "accepted",
  EXPIRED: "expired",
} as const;

export const QUOTE_STATUS_VALUES = Object.values(QUOTE_STATUS);

export type QuoteStatus = (typeof QUOTE_STATUS)[keyof typeof QUOTE_STATUS];
