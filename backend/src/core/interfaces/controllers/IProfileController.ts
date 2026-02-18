import { RequestHandler } from "express";

export interface IProfileController {
  getProfile: RequestHandler;
  updateProfile: RequestHandler;
  uploadImage: RequestHandler;
  changePassword: RequestHandler;
  changeEmail: RequestHandler;
  changePhone: RequestHandler;
  resentOtp: RequestHandler;
  verifyOtp: RequestHandler;
}
