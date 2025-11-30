import { RequestHandler } from "express";

export interface IProfileController {
  uploadImage: RequestHandler;
  changePassword: RequestHandler;
  changeEmail: RequestHandler;
  resentOtp: RequestHandler;
  verifyOtp: RequestHandler;
}
