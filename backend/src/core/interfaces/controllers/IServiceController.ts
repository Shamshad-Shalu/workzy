import { RequestHandler } from "express";

export interface IServiceController {
  createService: RequestHandler;
}
