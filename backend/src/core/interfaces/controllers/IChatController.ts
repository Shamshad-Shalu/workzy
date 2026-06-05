import { RequestHandler } from "express";

export interface IChatController {
  getChatRoomById: RequestHandler;
  getChatRooms: RequestHandler;
  createChatRoom: RequestHandler;
}
