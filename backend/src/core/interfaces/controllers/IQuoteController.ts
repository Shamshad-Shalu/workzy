import { RequestHandler } from "express";

export interface IQuoteController {
  createQuote: RequestHandler;
  listWorkerQuotes: RequestHandler;
  listUserQuotes: RequestHandler;
  getWokerQuoteStats: RequestHandler;
  rejectQuote: RequestHandler;
  acceptQuote: RequestHandler;
}
