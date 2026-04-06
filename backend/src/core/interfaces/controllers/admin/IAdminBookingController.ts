import { RequestHandler } from "express";

export interface IAdminBookingController {
  getUserBookings: RequestHandler;
  getWorkerBookings: RequestHandler;
  getAllBookings: RequestHandler;
}
