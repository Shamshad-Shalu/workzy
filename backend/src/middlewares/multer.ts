import multer from "multer";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();
const tempDir = path.join(__dirname, "..", "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, tempDir),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
});
