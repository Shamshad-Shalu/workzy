import { RequestHandler } from "express";

export interface IAuthController {
  register: RequestHandler;
}
