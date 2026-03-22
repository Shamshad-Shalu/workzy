export const BOOKING_STATUS_MESSAGES = {
  PENDING: "Booking created and awaiting confirmation",
  CONFIRMED: "Booking confirmed by worker",
  IN_PROGRESS: "Service is currently in progress",
  COMPLETED: "Service completed successfully",
  APPROVED: "Work approved by user",
  CANCELLED: "Booking cancelled",
  REJECTED: "Booking rejected by worker",
  DISPUTED: "Booking is under dispute",
};
export const BOOKING = {
  NOT_FOUND: "Booking is not found",
  CANNOT_CANCEL: (status: string) => `Cannot cancel a booking that is ${status}`,
};
