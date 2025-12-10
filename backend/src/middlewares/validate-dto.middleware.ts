import { AUTH, HTTPSTATUS } from "@/constants";
import CustomError from "@/utils/customError";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError, ValidatorOptions } from "class-validator";
import { NextFunction, Request, Response } from "express";

export const validateDto = <T extends object>(
  dtoClass: new () => T,
  options: ValidatorOptions = {}
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors: ValidationError[] = await validate(dtoInstance, options);

    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => {
        const firstMessage = Object.values(error.constraints || {})[0];
        return {
          field: error.property,
          messages: firstMessage,
        };
      });

      const validationError = new CustomError(
        AUTH.INVALID_INPUT,
        HTTPSTATUS.BAD_REQUEST
      ) as CustomError & {
        validationErrors?: unknown;
      };
      validationError.validationErrors = formattedErrors;

      return next(validationError);
    }

    req.body = dtoInstance;
    next();
  };
};
