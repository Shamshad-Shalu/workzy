import { RequestHandler } from "express";

export interface IBookingController {
  createBooking: RequestHandler;
  getBookingById: RequestHandler;
  getUserBookings: RequestHandler;

  cancelBooking: RequestHandler;
  approveBooking: RequestHandler;
  payExtraCharge: RequestHandler;
  rejectExtraCharge: RequestHandler;

  acceptBooking: RequestHandler;
  rejectBooking: RequestHandler;
  getWorkerBookings: RequestHandler;
  startJob: RequestHandler;
  completeJob: RequestHandler;
  requestExtraCharge: RequestHandler;
}
