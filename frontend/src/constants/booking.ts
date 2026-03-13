export const BOOKING_STEPS = {
  COUNT: 'count',
  DATE: 'date',
  SLOTS: 'slots',
  INSTRUCTIONS: 'instructions',
  REVIEW: 'review',
} as const;
export type BookingStep = (typeof BOOKING_STEPS)[keyof typeof BOOKING_STEPS];

export const STEP_LABELS: Record<BookingStep, string> = {
  count: 'Count',
  date: 'Date',
  slots: 'Time',
  instructions: 'Note',
  review: 'Review',
};
