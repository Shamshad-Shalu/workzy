import { RequestHandler } from "express";

export interface IPaymentController {
  handleWebhook: RequestHandler;
  verifySession: RequestHandler;
}
