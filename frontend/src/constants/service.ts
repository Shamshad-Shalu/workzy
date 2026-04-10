export const SERVICE_TYPE = {
  SMALL_TASK: 'Small Task',
  INSPECTION: 'Inspection',
  MAJOR_PROJECT: 'Major Project',
  CONSULTATION: 'Consultation',
  // REMOTE: 'Remote',
} as const;

export type ServiceType = (typeof SERVICE_TYPE)[keyof typeof SERVICE_TYPE];

export const PRICING_MODE = {
  FIXED: 'fixed',
  PER_UNIT: 'per_unit',
  // PER_DAY: 'per_day',
} as const;

export type PricingMode = (typeof PRICING_MODE)[keyof typeof PRICING_MODE];

export const HOUR_OPTIONS = Array.from({ length: 9 }, (_, i) => ({
  label: `${i} hr`,
  value: `${i}`,
}));

export const MINUTE_OPTIONS = ['0', '15', '30', '45'].map(m => ({
  label: `${m} min`,
  value: m,
}));

export const BUFFER_OPTIONS = ['0', '1', '2'].map(m => ({
  label: `${m} hr`,
  value: m,
}));
export const BULK_DISCOUNT = {
  MIN_COUNT: 2,
  MAX_COUNT: 10,
  MIN_PERCENT: 1,
  MAX_PERCENT: 50,
};
