import logger from "@/config/logger";
import { AUTH, HTTPSTATUS, Role } from "@/constants";
import { verifyAccessToken, verifyRefreshToken } from "@/utils/jwt.util";
import { NextFunction, Request, Response } from "express";

export const validateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(HTTPSTATUS.FORBIDDEN).json({ message: AUTH.NO_REFRESH_TOKEN });
      return;
    }
    const decoded = verifyRefreshToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: AUTH.NO_REFRESH_TOKEN, error });
  }
};

export const authenticate = (roles: Array<Role>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      console.log("token ,in the authonticate ", token);
      if (!token) {
        res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: "Access token not found" });
        return;
      }

      const decoded = verifyAccessToken(token);
      req.user = decoded;

      if (roles.length && (!req.user || !roles.includes(req.user?.role))) {
        logger.debug(req.user.role, roles);
        res.status(HTTPSTATUS.FORBIDDEN).json({ message: "Permission denied" });
        return;
      }
      next();
    } catch (error) {
      res
        .status(HTTPSTATUS.UNAUTHORIZED)
        .json({ message: "Invalid or expired access token", error });
    }
  };
};
