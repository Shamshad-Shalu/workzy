export const BOOKING_STATUS_MESSAGES = {
  PENDING: "Booking created and awaiting confirmation",
  CONFIRMED: "Booking confirmed by worker",
  IN_PROGRESS: "Service is currently in progress",
  COMPLETED: "Service completed successfully",
  APPROVED: "Work approved by user",
  CANCELLED: "Booking cancelled ",
  REJECTED: "Booking rejected by worker",
  DISPUTED: "Booking is under dispute",
};
export const BOOKING = {
  NOT_FOUND: "Booking is not found",
  CANNOT_CANCEL: (status: string) => `Cannot cancel a booking that is ${status}`,
  CANNOT_ACCEPT: (status: string) => `Cannot accept a booking that is already ${status}`,
  PAYMENT_NOT_CONFIRMED: "Cannot accept booking — payment has not been confirmed",
  CANNOT_REJECT: (status: string) => `Cannot reject a booking that is ${status}`,
  CANNOT_START: (status: string) =>
    `Job can only be started from confirmed state, current: ${status}`,
  CANNOT_COMPLETE: (status: string) =>
    `Job must be in progress to mark as completed, current: ${status}`,
  AFTER_EVIDENCE_REQUIRED: "At least one after-photo is required to complete the job",
  EXTRA_CHARGE_INVALID_STATUS:
    "Extra charge can only be requested during in-progress or completed jobs",
  EXTRA_CHARGE_ALREADY_EXISTS: "An extra charge has already been requested for this booking",
  CANNOT_APPROVE: (status: string) =>
    `Job must be completed before it can be approved, current: ${status}`,
  PAYMENT_NOT_HELD: "Payment is not in a held state",
  EXTRA_CHARGE_PENDING: "Please resolve the extra charge request before approving",
};
