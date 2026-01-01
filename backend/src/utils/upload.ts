import crypto from "crypto";

export function generateUniqueFileName(prefix: string, extension: string): string {
  const randomId = crypto.randomBytes(6).toString("hex");
  const timestamp = Date.now();
  return `${prefix}_${timestamp}_${randomId}.${extension}`;
}

export const MIME_TO_EXT: Record<string, string> = {
  // Images
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",

  // Documents
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",

  // Video
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/x-matroska": "mkv",
  "video/webm": "webm",

  // Audio
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/ogg": "ogg",

  // Archives
  "application/zip": "zip",
  "application/x-tar": "tar",
};

export function getFileExtension(mimetype: string, originalName?: string): string {
  if (MIME_TO_EXT[mimetype]) {
    return MIME_TO_EXT[mimetype];
  }

  if (originalName) {
    const ext = originalName.split(".").pop()?.toLowerCase();
    if (ext && Object.values(MIME_TO_EXT).includes(ext)) return ext; // Validate fallback
  }

  throw new Error(`Unsupported mimetype: ${mimetype}`);
}

export function getDefaultPrefix(folder: string): string {
  return folder.split("/").pop()?.replace("s", "") || "file";
}
