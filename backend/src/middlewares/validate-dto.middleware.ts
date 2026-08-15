import { plainToInstance } from "class-transformer";
import { validate, ValidationError, ValidatorOptions } from "class-validator";
import { NextFunction, Request, Response } from "express";

import { AUTH, HTTPSTATUS } from "@/constants";
import CustomError from "@/utils/customError";

function flattenErrors(
  errors: ValidationError[],
  parent = ""
): { field: string; messages: string }[] {
  const result: { field: string; messages: string }[] = [];

  for (const e of errors) {
    const field = parent ? `${parent}.${e.property}` : e.property;
    if (e.constraints) {
      result.push({
        field,
        messages: Object.values(e.constraints)[0],
      });
    }

    if (e.children?.length) {
      result.push(...flattenErrors(e.children, field));
    }
  }

  return result;
}

export const validateDto = <T extends object>(
  dtoClass: new () => T,
  options: ValidatorOptions = {}
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body, { enableImplicitConversion: true });
    const errors: ValidationError[] = await validate(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
      ...options,
    });

    if (errors.length > 0) {
      const formattedErrors = flattenErrors(errors);
      const validationError = new CustomError(
        AUTH.INVALID_INPUT,
        HTTPSTATUS.BAD_REQUEST,
        formattedErrors
      );
      return next(validationError);
    }

    req.body = dtoInstance;
    next();
  };
};
