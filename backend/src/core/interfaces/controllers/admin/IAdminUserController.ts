import { RequestHandler } from "express";

export interface IAdminUserController {
  listUsers: RequestHandler;
  toggleStatus: RequestHandler;
  getUserById: RequestHandler;
  getUserStats: RequestHandler;
}
