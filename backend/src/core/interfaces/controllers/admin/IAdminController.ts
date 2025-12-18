import { RequestHandler } from "express";

export interface IAdminController {
  getUsers: RequestHandler;
  getAllWorkers: RequestHandler;
  toggleStatus: RequestHandler;
  verifyWorker: RequestHandler;
}
