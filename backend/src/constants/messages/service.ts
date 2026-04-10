export const SERVICE = {
  CREATED: "Service created successfully.",
  UPDATED: "Service updated successfully.",
  PRICE_OUT_OF_RANGE: "Service price must be within the allowed market price range.",
  DURATION_OUT_OF_RANGE: (min: string, max: string) =>
    `Estimated duration must be between ${min} and ${max} minutes`,
  INSPECTION_MIN_BUFFER: (minBuffer: number) =>
    `Inspection services require minimum ${minBuffer} minutes buffer`,
  BUFFER_EXCEEDS_DURATION: "Buffer time cannot exceed service duration",
  BUFFER_EXCEEDS_CATEGORY_DEFAULT: (maxBuffer: string) =>
    `Buffer time cannot exceed category default (${maxBuffer} minutes)`,
  NOT_FOUND: "Service not found.",
  UPDATE_ERROR: "Error while updating service",
  ALREADY_EXISTS: "A service for this category already exists.",
  BLOCKED: "Service blocked successfully.",
  UNBLOCKED: "Service unblocked successfully.",
  REQUIRED: "ServiceId is required.",
};
