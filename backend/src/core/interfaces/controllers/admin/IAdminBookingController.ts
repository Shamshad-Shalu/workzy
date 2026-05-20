import { RequestHandler } from "express";

export interface IAdminBookingController {
  addNote: RequestHandler;
  cancelBooking: RequestHandler;
}
