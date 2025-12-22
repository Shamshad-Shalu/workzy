import { RequestHandler } from "express";

export interface IWorkerController {
  createWorkerProfile: RequestHandler;
  getWorkerSummary: RequestHandler;
  getWorkerProfile: RequestHandler;
  updateWorkerProfile: RequestHandler;
  getMe: RequestHandler;
  reSubmitWorkerDocument: RequestHandler;
}
