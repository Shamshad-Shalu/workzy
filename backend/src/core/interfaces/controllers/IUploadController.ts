import { RequestHandler } from "express";

export interface IUploadController {
  requestUploadUrl: RequestHandler;
}
