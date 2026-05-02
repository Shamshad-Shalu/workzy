import { RequestHandler } from "express";

export interface IQuoteController {
  createQuote: RequestHandler;
}
