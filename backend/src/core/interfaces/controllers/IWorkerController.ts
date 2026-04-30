import { RequestHandler } from "express";

export interface IWorkerController {
  listPublicWorkers: RequestHandler;
  getWorkerProfile: RequestHandler;
  getWorkerProfileDetails: RequestHandler;

  updateWorkerProfile: RequestHandler;
  updateWorkerPhone: RequestHandler;
  updateProfileImage: RequestHandler;

  createWorkerProfile: RequestHandler;
  reSubmitWorkerDocument: RequestHandler;
  connectStripe: RequestHandler;
  getStripeStatus: RequestHandler;
  // getWorkerAbout
}
