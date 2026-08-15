import { NextFunction, Request, Response } from "express";

import logger from "@/config/logger";
import { SERVER } from "@/constants";
import CustomError from "@/utils/customError";

const errorMiddleware = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error("Error occurred:", err);
  console.log(err);

  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  const message = err.message || SERVER.ERROR;

  const response: {
    success: false;
    message: string;
    errors?: unknown;
  } = { success: false, message };

  if (err instanceof CustomError && err.errors) {
    response.errors = err.errors;
  }

  logger.error(statusCode.toString(), message);
  res.status(statusCode).json(response);
};

export default errorMiddleware;
