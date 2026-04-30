import { RequestHandler } from "express";

export interface IUserController {
  updateProfile: RequestHandler;
  uploadImage: RequestHandler;
  confirmOtpAndUpdateContact: RequestHandler;

  changePassword: RequestHandler;
  changeEmail: RequestHandler;
  changePhone: RequestHandler;
  resentOtp: RequestHandler;
}
