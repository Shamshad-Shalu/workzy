import { RequestHandler } from "express";

export interface IAuthController {
  register: RequestHandler;
  verifyOTP: RequestHandler;
  resendOtp: RequestHandler;
  login: RequestHandler;
  logout: RequestHandler;
}
