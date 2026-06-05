import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { CHAT, HTTPSTATUS, SenderRole } from "@/constants";
import { IMessageController } from "@/core/interfaces/controllers/IMessageController";
import { IMessageService } from "@/core/interfaces/services/IMessageService";
import { TYPES } from "@/di/types";
import CustomError from "@/utils/customError";

@injectable()
export class MessageController implements IMessageController {
  constructor(@inject(TYPES.MessageService) private _messageService: IMessageService) {}

  getMessages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { chatId } = req.params;
    const role = req.user?.role;
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 50);
    const parsedCursor = req.query.cursor
      ? JSON.parse(Buffer.from(req.query.cursor as string, "base64url").toString("utf8"))
      : undefined;
    if (!chatId) {
      throw new CustomError(CHAT.NOT_FOUND);
    }
    const { data, nextCursor } = await this._messageService.getMessages({
      chatId,
      limit,
      cursor: parsedCursor,
      role: role as SenderRole,
    });
    res.status(HTTPSTATUS.OK).json({ messages: data, nextCursor: nextCursor });
  });
}
