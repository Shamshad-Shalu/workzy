export const DISPUTE_REASON = {
  NOT_FINISHED: "work_not_finished",
  POOR_QUALITY: "poor_quality",
  OVERCHARGED: "overcharged",
  NO_SHOW: "worker_no_show",
  DAMAGE: "property_damage",
  OTHER: "other",
} as const;

export const DISPUTE_REASON_VALUES = Object.values(DISPUTE_REASON);
export type DisputeReason = (typeof DISPUTE_REASON)[keyof typeof DISPUTE_REASON];

export const DISPUTE_STATUS = {
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  RESOLVED: "resolved",
  DISMISSED: "dismissed",
} as const;

export const DISPUTE_STATUS_VALUES = Object.values(DISPUTE_STATUS);
export type DisputeStatus = (typeof DISPUTE_STATUS)[keyof typeof DISPUTE_STATUS];

export const DISPUTE_RESOLUTION = {
  REFUND_FULL: "refund_full",
  REFUND_PARTIAL: "refund_partial",
  PAYOUT_WORKER: "payout_worker",
} as const;

export type DisputeResolution = (typeof DISPUTE_RESOLUTION)[keyof typeof DISPUTE_RESOLUTION];
