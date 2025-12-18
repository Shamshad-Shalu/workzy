import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import winston from "winston";
import { NODE_ENV } from "@/constants";

const customColors = {
  error: "brightRed",
  warn: "brightYellow",
  info: "brightGreen",
  http: "brightCyan",
  debug: "brightBlue",
};

const isProd = NODE_ENV === "production";

winston.addColors(customColors);
const logger = createLogger({
  level: isProd ? "info" : "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    }),
    new DailyRotateFile({
      filename: "logs/app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      level: "info",
    }),
  ],
});

export default logger;
