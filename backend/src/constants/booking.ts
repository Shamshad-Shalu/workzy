export const BOOKING_STATUS = {
  PENDING: "pending", // payment success, worker notified
  CONFIRMED: "confirmed", //worker accepted
  IN_PROGRESS: "in_progress", // worker started job
  COMPLETED: "completed", // job finished
  APPROVED: "approved", // user approved
  CANCELLED: "cancelled", // cancelled before start
  REJECTED: "rejected", // worker rejected
  DISPUTED: "disputed", // user raised dispute
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
