export const BOOKING_STATUS = {
  PENDING_PAYMENT: "pending_payment", // before user pays
  CONFIRMED: "confirmed", // user paid
  IN_PROGRESS: "in_progress", // worker started
  COMPLETED: "completed", // worker marked done
  CANCELLED: "cancelled",
  DISPUTED: "disputed",
} as const;
export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const BOOKING_PAYMENT_STATUS = {
  UNPAID: "unpaid", // not paid yet
  HELD: "held", // paid, frozen in Stripe ← escrow
  RELEASED: "released", // captured, worker paid
  REFUNDED: "refunded", // cancelled, money returned
} as const;
export type BookingPaymentStatus =
  (typeof BOOKING_PAYMENT_STATUS)[keyof typeof BOOKING_PAYMENT_STATUS];
