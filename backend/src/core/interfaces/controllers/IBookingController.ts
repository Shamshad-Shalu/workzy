import { RequestHandler } from "express";

export interface IBookingController {
  createBooking: RequestHandler;
  getUserBookings: RequestHandler;
  // getBookingById: RequestHandler;
  // cancelBooking: RequestHandler;
  // startBooking: RequestHandler;
  // completeBooking: RequestHandler;
}
