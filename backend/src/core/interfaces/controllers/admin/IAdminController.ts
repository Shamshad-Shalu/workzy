import { RequestHandler } from "express";

export interface IAdminController {
  getUsers: RequestHandler;
  toggleStatus: RequestHandler;
}
