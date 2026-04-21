export const BOOKING_STATUS_MESSAGES = {
  PENDING: "Booking confirmed, waiting for worker to accept",
  CONFIRMED: "Worker accepted your booking",
  EN_ROUTE: "Worker is on the way",
  REACHED: "Status Marked as reached and waiting for OTP confirmation",
  IN_PROGRESS: "Job is in progress",
  COMPLETED: "Job completed",
  APPROVED: "Job approved and payment released",
  CANCELLED: "Booking cancelled",
  REJECTED: "Booking rejected by worker",
  DISPUTED: "Dispute raised",
  EXPIRED: "Booking expired — worker did not respond before the scheduled time.",
};

export const BOOKING = {
  NOT_FOUND: "Booking not found",
  PAYMENT_NOT_HELD: "Payment is not in held state",
  EXTRA_CHARGE_PENDING: "Resolve pending extra charge before approving",
  EXTRA_CHARGE_INVALID_STATUS: "Extra charge can only be requested during or after job",
  EXTRA_CHARGE_NOT_FOUND: "No pending extra charge found on this booking.",
  INVALID_OTP: "Invalid OTP. Please check with the user.",
  CANNOT_CANCEL: (s: string) => `Cannot cancel booking with status: ${s}`,

  CANNOT_ACCEPT:
    "This booking cannot be accepted. It may have already been confirmed, cancelled, expired, or payment is not yet received.",
  CANNOT_EN_ROUTE:
    "Booking cannot be marked en-route. It must be in confirmed status and assigned to you.",
  CANNOT_COMPLETE: "Booking cannot be completed. It must be in progress and assigned to you.",
  CANNOT_REACH: "This booking cannot be reached.",

  CANNOT_REJECT: (s: string) => `Cannot reject booking with status: ${s}`,
  CANNOT_START: (s: string) => `Cannot start job from status: ${s}`,
  CANNOT_APPROVE: (s: string) => `Cannot approve booking with status: ${s}`,
};

// export const BOOKING = {
//   NOT_FOUND: "Booking not found.",
//   PAYMENT_NOT_CONFIRMED: "Payment has not been confirmed for this booking.",
//   PAYMENT_NOT_HELD: "Payment is not in held state for this booking.",
//   EXTRA_CHARGE_PENDING: "Please resolve the pending extra charge before approving.",
//   EXTRA_CHARGE_INVALID_STATUS: "Extra charge can only be requested on in-progress or completed bookings.",
//   EXTRA_CHARGE_ALREADY_EXISTS: "An extra charge request already exists for this booking.",
//   EXTRA_CHARGE_NOT_FOUND: "No pending extra charge found on this booking.",
//   INVALID_OTP: "Invalid OTP provided.",
//   CANNOT_ACCEPT: "Booking cannot be accepted. It may already be confirmed, cancelled, expired, or payment is pending.",
//   CANNOT_REJECT: (status: string) => `Booking cannot be rejected in '${status}' status.`,
//   CANNOT_CANCEL: (status: string) => `Booking cannot be cancelled in '${status}' status.`,
//   CANNOT_COMPLETE: "Booking cannot be completed. It may not be in progress or you are not assigned to it.",
//   CANNOT_APPROVE: (status: string) => `Booking cannot be approved in '${status}' status.`,
//   CANNOT_EN_ROUTE: (status: string) => `Cannot mark en-route in '${status}' status.`,
//   CANNOT_REACH: (status: string) => `Cannot mark reached in '${status}' status.`,
//   CANNOT_START: (status: string) => `Cannot start job in '${status}' status.`,
// } as const;
