export const UploadPurposes = {
  PROFILE_IMAGE: 'PROFILE_IMAGE',
  // Worker
  WORKER_DOCUMENT: 'WORKER_DOCUMENT',
  WORKER_COVER_IMAGE: 'WORKER_COVER_IMAGE',
  // Category
  CATEGORY_ICON: 'CATEGORY_ICON',
  CATEGORY_IMAGE: 'CATEGORY_IMAGE',
} as const;

export type UploadPurpose = (typeof UploadPurposes)[keyof typeof UploadPurposes];
