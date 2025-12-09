import { RequestHandler } from "express";

export interface IAdminServiceController {
  createService: RequestHandler;
  getServices: RequestHandler;
  updateService: RequestHandler;
  toggleStatus: RequestHandler;
}
