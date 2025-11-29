import multer from "multer";

const allowedMime = {
  image: ["image/jpeg", "image/png", "image/webp"],
  pdf: ["application/pdf"],
  audio: ["audio/mpeg", "audio/wav", "audio/mp4"],
  video: ["video/mp4", "video/quicktime", "video/x-msvideo"],
};

export function getCategory(mime: string): keyof typeof allowedMime | null {
  for (const key in allowedMime) {
    if (allowedMime[key as keyof typeof allowedMime].includes(mime)) {
      return key as keyof typeof allowedMime;
    }
  }
  return null;
}

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const category = getCategory(file.mimetype);
    if (!category) {
      return cb(
        new Error("Invalid file type. Only images, videos, audios, and PDFs allowed.") as any,
        false
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});
