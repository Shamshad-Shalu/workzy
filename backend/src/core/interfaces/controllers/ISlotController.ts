import { RequestHandler } from "express";

export interface ISlotController {
  getAvailableSlots: RequestHandler;
  reserveSlot: RequestHandler;
  releaseSlot: RequestHandler;
  getAvailableDates: RequestHandler;
  reserveQuoteSlots: RequestHandler;
}
