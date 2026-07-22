export const WORKER_STATUS = {
  PENDING: "pending",
  IN_REVIEW: "in_review",
  VERIFIED: "verified",
  REJECTED: "rejected",
  NEEDS_REVISION: "needs_revision",
  SUSPENDED: "suspended",
} as const;
export type WorkerStatus = (typeof WORKER_STATUS)[keyof typeof WORKER_STATUS];

export const ACTIVE_WORKER_STATUSES: WorkerStatus[] = [
  WORKER_STATUS.VERIFIED,
  WORKER_STATUS.SUSPENDED,
];

export const DOCUMENT_TYPE = {
  AADHAAR: "aadhaar",
  PAN: "pan",
  PROFILE_PHOTO: "profile_photo",
  SELFIE_VERIFICATION: "selfie_verification",

  // Professional (Optional)
  TRADE_CERTIFICATE: "trade_certificate",
  SKILL_CERTIFICATE: "skill_certificate",
  EXPERIENCE_LETTER: "experience_letter",
  PROFESSIONAL_LICENSE: "professional_license",

  // Trust & Safety (Optional)
  POLICE_CLEARANCE: "police_clearance",
  INSURANCE: "insurance",

  // Business (Optional)
  GST_CERTIFICATE: "gst_certificate",
  BUSINESS_REGISTRATION: "business_registration",

  // Misc
  OTHER: "other",
} as const;

export type DocumentType = (typeof DOCUMENT_TYPE)[keyof typeof DOCUMENT_TYPE];

export const DOCUMENT_STATUS = {
  PENDING: "pending",
  IN_REVIEW: "in_review",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

export type DocumentStatus = (typeof DOCUMENT_STATUS)[keyof typeof DOCUMENT_STATUS];

export const STRIPE_ACCOUNT_STATUS = {
  NOT_CONNECTED: "not_connected",
  PENDING: "pending",
  ACTIVE: "active",
} as const;
export type StripeAccountStatus =
  (typeof STRIPE_ACCOUNT_STATUS)[keyof typeof STRIPE_ACCOUNT_STATUS];

export const WORKER_JOIN_DOCUMENT_KEY_MAP = {
  aadhaar: DOCUMENT_TYPE.AADHAAR,
  pan: DOCUMENT_TYPE.PAN,
  selfie: DOCUMENT_TYPE.SELFIE_VERIFICATION,
  profile: DOCUMENT_TYPE.PROFILE_PHOTO,
} as const;
