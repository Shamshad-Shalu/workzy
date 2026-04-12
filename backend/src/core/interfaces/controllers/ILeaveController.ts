import { RequestHandler } from "express";

export interface ILeaveController {
  createLeave: RequestHandler;
  cancelLeave: RequestHandler;
  getWorkerLeaves: RequestHandler;
  getWorkerLeaveStats: RequestHandler;
}
