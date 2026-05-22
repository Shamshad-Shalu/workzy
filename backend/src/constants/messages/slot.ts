export const SLOT = {
  NOT_FOUND: "Slot not found",
  CREATED: "Slot created successfully.",
  EXISTS: "Slot already reserved ",
  INVALID_DATE: "Invalid Date",
  FIELDS_REQUIRED: "workerId, serviceId , locations and date are required",
  RELEASE_ERROR: "Slot not found or cannot be released",
  RELEASED: "Slot released successfully",
  NOT_AVAILABLE: "This slot is no longer available",
  UNAUTHORIZED: "Unauthorized user for this slot",
  WORKER_NEED: "workerId and serviceId are required",
  EXPIRED: "This slot is no longer available. Please select another slot.",
  // Reschedule
  RESCHEDULE_INVALID_PARAMS:
    "Invalid reschedule parameters: startTime is required for single-day bookings",
  RESCHEDULE_UNAUTHORIZED:
    "Unauthorized: Only the party initiating the reschedule can reserve the new slot",
};
