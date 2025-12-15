import { RequestHandler } from "express";

export interface IWorkerController {
  getWorkerProfile: RequestHandler;
  getWorkerSummary: RequestHandler;
}
