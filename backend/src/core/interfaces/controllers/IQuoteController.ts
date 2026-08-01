import { RequestHandler } from "express";

export interface IQuoteController {
  createQuote: RequestHandler;
  updateQuote: RequestHandler;
  listQuotes: RequestHandler;
  getWorkerQuoteStats: RequestHandler;
  rejectQuote: RequestHandler;
  acceptQuote: RequestHandler;
}
