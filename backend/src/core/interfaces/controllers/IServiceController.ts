import { RequestHandler } from "express";

export interface IServiceController {
  createService: RequestHandler;
  updateService: RequestHandler;
  toggleStatus: RequestHandler;
  getWorkerServices: RequestHandler;
  getWorkerServiceCategories: RequestHandler;
}
