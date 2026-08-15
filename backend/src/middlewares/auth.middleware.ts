import { NextFunction, Request, Response } from "express";

import logger from "@/config/logger";
import { AUTH, HTTPSTATUS, Role } from "@/constants";
import { verifyAccessToken, verifyRefreshToken } from "@/utils/auth/jwt.util";
import CustomError from "@/utils/customError";

export const validateRefreshToken = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return next(new CustomError(AUTH.NO_REFRESH_TOKEN, HTTPSTATUS.FORBIDDEN));
    }
    const decoded = verifyRefreshToken(token);
    req.user = {
      id: decoded.user.id,
      role: decoded.user.role,
    };
    next();
  } catch {
    return next(new CustomError(AUTH.NO_REFRESH_TOKEN, HTTPSTATUS.UNAUTHORIZED));
  }
};

export const authenticate = (roles: Array<Role>) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return next(new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED));
      }

      const decoded = verifyAccessToken(token);
      req.user = decoded;

      if (roles.length && (!req.user || !roles.includes(req.user?.role))) {
        logger.debug(req.user.role, roles);
        return next(new CustomError(AUTH.ACCESS_DENIED, HTTPSTATUS.FORBIDDEN));
      }
      next();
    } catch {
      return next(new CustomError(AUTH.TOKEN_INVALID, HTTPSTATUS.UNAUTHORIZED));
    }
  };
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next();
    }
    const decoded = verifyAccessToken(token);
    req.user = decoded;

    return next();
  } catch (error) {
    logger.warn("Optional auth failed:", error);
    return next();
  }
};
