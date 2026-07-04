import fs from "fs";
import path from "path";

import { Request, Response, NextFunction } from "express";

const logDir = path.join(process.cwd(), "logs");
const logFile = path.join(logDir, "api.log");

export const apiLogger = (req: Request, res: Response, next: NextFunction) => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const log = [
      `[${new Date().toISOString()}]`,
      `${req.method}`,
      `${req.originalUrl}`,
      `Status:${res.statusCode}`,
      `${duration}ms`,
      `IP:${req.ip}`,
    ].join(" | ");

    fs.appendFile(logFile, log + "\n", (err) => {
      if (err) {
        console.error("Failed to write API log:", err);
      }
    });
  });

  next();
};
