import { RequestHandler } from "express";

export interface IMessageController {
  getMessages: RequestHandler;
}
