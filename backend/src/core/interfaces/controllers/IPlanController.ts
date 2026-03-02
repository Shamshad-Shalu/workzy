import { RequestHandler } from "express";

export interface IPlanController {
  getPlan: RequestHandler;
  getAllPlans: RequestHandler;
  createPlan: RequestHandler;
  updatePlan: RequestHandler;
  getActiveOffers: RequestHandler;
}
