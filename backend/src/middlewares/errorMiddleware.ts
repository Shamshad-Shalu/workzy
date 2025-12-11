import logger from "@/config/logger";
import { SERVER } from "@/constants";
import CustomError from "@/utils/customError";
import { NextFunction, Request, Response } from "express";

interface CustomErrorWithValidation extends CustomError {
  validationErrors?: unknown;
}

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

  const response: { message: string; errors?: unknown } = { message };

  if ((err as CustomErrorWithValidation).validationErrors) {
    response.errors = (err as CustomErrorWithValidation).validationErrors;
  }

  logger.error(statusCode.toString(), message);
  res.status(statusCode).json(response);
};

export default errorMiddleware;
