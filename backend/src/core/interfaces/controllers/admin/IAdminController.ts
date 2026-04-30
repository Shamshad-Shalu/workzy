import { RequestHandler } from "express";

export interface IAdminController {
  listUsers: RequestHandler;
  listWorkers: RequestHandler;
  toggleStatus: RequestHandler;
  verifyWorker: RequestHandler;
}
