import { AUTH, HTTPSTATUS } from "@/constants";
import { verifyRefreshToken } from "@/utils/jwt.util";
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

export const authenticate = () => {};
