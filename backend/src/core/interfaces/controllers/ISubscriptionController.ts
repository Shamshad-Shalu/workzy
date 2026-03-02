import { RequestHandler } from "express";

export interface ISubscriptionController {
  getMySubscription: RequestHandler;
}
