export const DISPUTE_REASON = {
  NOT_FINISHED: 'work_not_finished',
  POOR_QUALITY: 'poor_quality',
  OVERCHARGED: 'overcharged',
  NO_SHOW: 'worker_no_show',
  DAMAGE: 'property_damage',
  OTHER: 'other',
} as const;

export const DISPUTE_REASON_VALUES = Object.values(DISPUTE_REASON);
export type DisputeReason = (typeof DISPUTE_REASON)[keyof typeof DISPUTE_REASON];

export const DISPUTE_REASON_LABELS: Record<string, string> = {
  [DISPUTE_REASON.NOT_FINISHED]: 'Work was not finished',
  [DISPUTE_REASON.POOR_QUALITY]: 'Poor quality of service',
  [DISPUTE_REASON.OVERCHARGED]: 'Overcharged for materials/service',
  [DISPUTE_REASON.NO_SHOW]: 'Worker did not show up',
  [DISPUTE_REASON.DAMAGE]: 'Property was damaged',
  [DISPUTE_REASON.OTHER]: 'Other issue',
};

export const DISPUTE_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed',
} as const;

export const DISPUTE_STATUS_VALUES = Object.values(DISPUTE_STATUS);
export type DisputeStatus = (typeof DISPUTE_STATUS)[keyof typeof DISPUTE_STATUS];

export const DISPUTE_RESOLUTION = {
  REFUND_FULL: 'refund_full',
  REFUND_PARTIAL: 'refund_partial',
  PAYOUT_WORKER: 'payout_worker',
} as const;

export const DISPUTE_RESOLUTION_VALUES = Object.values(DISPUTE_RESOLUTION);
export type DisputeResolution = (typeof DISPUTE_RESOLUTION)[keyof typeof DISPUTE_RESOLUTION];

export const DISPUTE_RESOLUTION_LABELS: Record<string, string> = {
  [DISPUTE_RESOLUTION.REFUND_FULL]: 'Full Refund to Customer',
  [DISPUTE_RESOLUTION.REFUND_PARTIAL]: 'Partial Refund to Customer',
  [DISPUTE_RESOLUTION.PAYOUT_WORKER]: 'Full Payout to Worker',
};
