import { AUTH, HTTPSTATUS } from "@/constants";
import CustomError from "@/utils/customError";
import { plainToInstance } from "class-transformer";
import { validate, ValidatorOptions } from "class-validator";
import { NextFunction, Request, Response } from "express";

export const validateDto = (dtoClass: any, options: ValidatorOptions = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoInstance, options);

    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => {
        const firstMessage = Object.values(error.constraints || {})[0];
        return {
          field: error.property,
          messages: firstMessage,
        };
      });

      const validationError = new CustomError(AUTH.INVALID_INPUT, HTTPSTATUS.BAD_REQUEST);
      (validationError as any).errors = formattedErrors;

      return next(validationError);
    }

    req.body = dtoInstance;
    next();
  };
};
