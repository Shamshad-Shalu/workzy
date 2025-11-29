import { NextFunction, Request, Response } from "express";
import { getCategory } from "./multer";

const sizeLimits = {
  image: 5 * 1024 * 1024, // 5MB
  pdf: 15 * 1024 * 1024, // 15MB
  audio: 20 * 1024 * 1024, // 20MB
  video: 100 * 1024 * 1024, // 100MB
};

export function validateFileSize(req: Request, res: Response, next: NextFunction) {
  const file = req.file;
  if (!file) return next();

  const error = validateHelper(file);
  if (error) return res.status(400).json({ message: error });

  next();
}

export function validateMultipleFilesSize(req: Request, res: Response, next: NextFunction) {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) return next();

  for (const file of files) {
    const error = validateHelper(file);
    if (error) return res.status(400).json({ message: error });
  }
  next();
}
function validateHelper(file: Express.Multer.File): string | null {
  const category = getCategory(file.mimetype);
  if (!category) {
    return "Invalid file type";
  }
  if (file.size > sizeLimits[category]) {
    return `${category} must be smaller than ${sizeLimits[category] / (1024 * 1024)}MB`;
  }
  return null;
}
