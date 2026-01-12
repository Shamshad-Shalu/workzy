export const UploadPurposes = {
  PROFILE_IMAGE: 'PROFILE_IMAGE',
  // Worker
  WORKER_DOCUMENT: 'WORKER_DOCUMENT',
  WORKER_COVER_IMAGE: 'WORKER_COVER_IMAGE',
  // Service
  SERVICE_ICON: 'SERVICE_ICON',
  SERVICE_IMAGE: 'SERVICE_IMAGE',
} as const;

export type UploadPurpose = (typeof UploadPurposes)[keyof typeof UploadPurposes];
