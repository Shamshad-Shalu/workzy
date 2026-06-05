import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, HTTPSTATUS, ROLE, SenderRole } from "@/constants";
import { IChatController } from "@/core/interfaces/controllers/IChatController";
import { IChatService } from "@/core/interfaces/services/IChatService";
import { TYPES } from "@/di/types";
import CustomError from "@/utils/customError";

@injectable()
export class ChatController implements IChatController {
  constructor(@inject(TYPES.ChatService) private _chatService: IChatService) {}

  getChatRoomById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { chatId } = req.params;
    const role = req.query.role as SenderRole;
    const participantId =
      role === ROLE.WORKER ? this.requireWorkerId(req) : this.requireUserId(req);

    const chat = await this._chatService.getChatRoomById({
      chatId,
      participantId,
      role,
    });
    res.status(HTTPSTATUS.OK).json(chat);
  });

  getChatRooms = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const role = req.user?.role as SenderRole | undefined;
    if (!role) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }

    const isWorker = role === ROLE.WORKER;
    const isAdmin = role === ROLE.ADMIN;
    const isActive = req.query.isActive as string | undefined;

    let userId: string | undefined = undefined;
    let workerId: string | undefined = undefined;

    if (isAdmin) {
      userId = undefined;
      workerId = undefined;
    } else if (isWorker) {
      workerId = this.requireWorkerId(req);
    } else {
      userId = this.requireUserId(req);
    }

    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 50);
    const search = (req.query.search as string) ?? "";
    const parsedCursor = req.query.cursor
      ? JSON.parse(Buffer.from(req.query.cursor as string, "base64url").toString("utf8"))
      : undefined;

    const { data, nextCursor } = await this._chatService.getChatRooms({
      userId,
      workerId,
      limit,
      search,
      role,
      cursor: parsedCursor,
      isActive: isActive !== undefined ? isActive === "true" : undefined,
    });

    res.status(HTTPSTATUS.OK).json({ chats: data, nextCursor });
  });

  createChatRoom = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.body;
    const role = req.user?.role as SenderRole;
    const creatorId = role === ROLE.WORKER ? this.requireWorkerId(req) : this.requireUserId(req);

    const chat = await this._chatService.createChatRoom(bookingId, creatorId, role);
    res.status(HTTPSTATUS.CREATED).json(chat);
  });

  private requireUserId(req: Request): string {
    if (!req.user?.id) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    return req.user.id;
  }

  private requireWorkerId(req: Request): string {
    if (!req.user?.workerId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    return req.user.workerId;
  }
}
