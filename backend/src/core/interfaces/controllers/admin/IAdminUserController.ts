import { RequestHandler } from "express";

export interface IAdminUserController {
  listUsers: RequestHandler;
  toggleStatus: RequestHandler;
}
