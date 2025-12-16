import { parseMultipartBody } from "@/utils/parseMultipartBody";
import { NextFunction, Request, Response } from "express";

export function parseMultipart(options?: { skip?: string[]; forceJson?: string[] }) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) return next();
    req.body = parseMultipartBody(req.body, options);
    next();
  };
}
