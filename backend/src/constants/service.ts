export const SERVICE_TYPE = {
  SMALL_TASK: "Small Task",
  INSPECTION: "Inspection",
  MAJOR_PROJECT: "Major Project",
  CONSULTATION: "Consultation",
} as const;

export type ServiceType = (typeof SERVICE_TYPE)[keyof typeof SERVICE_TYPE];
export const SERVICE_TYPE_VALUES = Object.values(SERVICE_TYPE);

export const PRICING_MODE = {
  FIXED: "fixed",
  PER_UNIT: "per_unit",
} as const;

export type PricingMode = (typeof PRICING_MODE)[keyof typeof PRICING_MODE];
export const PRICING_MODE_VALUES = Object.values(PRICING_MODE);

export const BULK_DISCOUNT = {
  MIN_COUNT: 2,
  MAX_COUNT: 10,
  MIN_PERCENT: 1,
  MAX_PERCENT: 50,
};
