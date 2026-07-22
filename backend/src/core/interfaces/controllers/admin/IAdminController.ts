import { RequestHandler } from "express";

export interface IAdminController {
  getAdminDashboard: RequestHandler;
}
