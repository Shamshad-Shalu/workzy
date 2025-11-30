import { RequestHandler } from "express";

export interface IProfileController {
  uploadImage: RequestHandler;
  changePassword: RequestHandler;
}
