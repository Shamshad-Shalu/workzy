export const DISPUTE = {
  NOT_FOUND: "Dispute not found",
  UNAUTHORIZED: "You are not authorized to update this dispute",
  RESOLVED: "Dispute resolved successfully",
  ALREADY_EXISTS: "A dispute for this Booking already exists.",
  ALREADY_RESOLVED: "Dispute is already resolved.",
  RESOLVE_REQUIRED: "Resolution type is required to resolve dispute.",
  PARTIAL_REFUND_REQUIRED: "Refunded amount is required for partial refund.",
  RAISED: "Dispute raised successfully.",
  UPDATED: "Dispute updated successfully.",
  FAILED: "Failed to process dispute.",
  RESOLVE_FAILED: "Failed to resolve dispute.",
  CANT_REFUND: "Can't refund for this dispute.",
  REFUND_GREATER: (amount: number) =>
    `Refunded amount must be Less than Booking amount of ${amount}`,
};
