import { RequestHandler } from "express";

export interface ISubscriptionController {
  getMySubscription: RequestHandler;
  addSubscription: RequestHandler;
  // updateAutoRenew:RequestHandler;
}
