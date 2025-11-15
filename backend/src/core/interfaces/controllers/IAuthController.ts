import { RequestHandler } from "express";

export interface IAuthController {
  register: RequestHandler;
  verifyOTP: RequestHandler;
  resendOtp: RequestHandler;
}
