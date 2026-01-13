export const FILE_TYPES = {
  IMAGES: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/jpg"],

  DOCUMENTS: ["application/pdf", "application/msword", "image/jpeg", "image/png"],

  VIDEOS: ["video/mp4", "video/webm", "video/quicktime"],

  AUDIOS: ["audio/mpeg", "audio/wav", "audio/ogg"],
} as const;

export const PURPOSE_POLICY = {
  PROFILE_IMAGE: {
    folder: "private/user/profiles",
    maxSizeMB: 10,
    allowedTypes: FILE_TYPES.IMAGES,
  },

  CATEGORY_ICON: {
    folder: "public/categories/icons",
    maxSizeMB: 10,
    allowedTypes: FILE_TYPES.IMAGES,
  },

  CATEGORY_IMAGE: {
    folder: "public/categories/images",
    maxSizeMB: 10,
    allowedTypes: FILE_TYPES.IMAGES,
  },

  WORKER_DOCUMENT: {
    folder: "private/worker/documents",
    maxSizeMB: 10,
    allowedTypes: FILE_TYPES.IMAGES,
  },

  WORKER_COVER_IMAGE: {
    folder: "public/worker/coverImages",
    maxSizeMB: 10,
    allowedTypes: FILE_TYPES.IMAGES,
  },
} as const;

export type UploadPurpose = keyof typeof PURPOSE_POLICY;
export const UploadPurposes = Object.keys(PURPOSE_POLICY);
