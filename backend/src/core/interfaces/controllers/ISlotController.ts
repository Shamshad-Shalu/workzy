import { RequestHandler } from "express";

export interface ISlotController {
  getAvailableSlots: RequestHandler;
  reserveSlot: RequestHandler;
  releaseSlot: RequestHandler;
  reserveQuoteSlots: RequestHandler;
  getAvailableDates: RequestHandler;
  getAvailableDatesForQuotes: RequestHandler;
  getRescheduleDates: RequestHandler;
  getRescheduleSlots: RequestHandler;
  getRescheduleSlotOptions: RequestHandler;
  reserveRescheduleSlot: RequestHandler;
  releaseRescheduleSlot: RequestHandler;
}
