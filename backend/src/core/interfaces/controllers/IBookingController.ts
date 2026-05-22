import { RequestHandler } from "express";

export interface IBookingController {
  getBookings: RequestHandler;
  createBooking: RequestHandler;
  getBookingById: RequestHandler;
  getUserBookings: RequestHandler;

  cancelBooking: RequestHandler;
  approveBooking: RequestHandler;
  payExtraCharge: RequestHandler;
  rejectExtraCharge: RequestHandler;

  acceptBooking: RequestHandler;
  markEnRoute: RequestHandler;
  markReached: RequestHandler;
  rejectBooking: RequestHandler;
  getWorkerBookings: RequestHandler;
  startJob: RequestHandler;
  completeJob: RequestHandler;
  requestExtraCharge: RequestHandler;

  requestReschedule: RequestHandler;
  respondReschedule: RequestHandler;
  cancelReschedule: RequestHandler;
}
