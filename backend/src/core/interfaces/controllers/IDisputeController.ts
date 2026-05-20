import { RequestHandler } from "express";

export interface IDisputeController {
  raiseDispute: RequestHandler;
  getDisputeByBookingId: RequestHandler;
  updateDispute: RequestHandler;
  getAllDisputes: RequestHandler;
  getDisputeStats: RequestHandler;
  resolveDispute: RequestHandler;
}
