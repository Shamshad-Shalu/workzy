import logger from "@/config/logger";
import { SERVER } from "@/constants";
import CustomError from "@/utils/customError";
import { NextFunction, Request, Response } from "express";

const errorMiddleware = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error("Error occurred:", err);

  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  const message = err.message || SERVER.ERROR;

  const response: Record<string, any> = {
    message,
  };

  if ((err as any).errors) {
    response.errors = (err as any).errors;
  }

  logger.error(statusCode.toString(), message);
  res.status(statusCode).json(response);
};

export default errorMiddleware;
