
export const ROLE = {
  USER: "user",
  ADMIN: "admin",
  WORKER: "worker",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

export const WORKER_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  NEEDS_REVISION: 'needs_revision',
} as const;

export type WORKER_STATUSES =
  (typeof WORKER_STATUS)[keyof typeof WORKER_STATUS];