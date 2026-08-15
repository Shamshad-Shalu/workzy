import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, CHAT, HTTPSTATUS, ROLE, SenderRole } from "@/constants";
import { IChatController } from "@/core/interfaces/controllers/IChatController";
import { IChatService } from "@/core/interfaces/services/IChatService";
import { TYPES } from "@/di/types";
import { ApiResponse } from "@/utils/apiResponse";
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
    res.status(HTTPSTATUS.OK).json(new ApiResponse(chat));
  });

  getChatRooms = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const role = req.user?.role as SenderRole | undefined;
    if (!role) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }

    const isWorker = role === ROLE.WORKER;
    const isAdmin = role === ROLE.ADMIN;

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
    });
    res.status(HTTPSTATUS.OK).json(new ApiResponse({ chats: data, nextCursor }));
  });

  getOrCreateChat = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const role = req.user?.role as SenderRole;
    const creatorId = role === ROLE.WORKER ? this.requireWorkerId(req) : this.requireUserId(req);

    if (role === ROLE.ADMIN) {
      throw new CustomError(AUTH.ACCESS_DENIED, HTTPSTATUS.FORBIDDEN);
    }
    const { participantId } = req.body;
    if (!participantId) {
      throw new CustomError(CHAT.INVALID_INPUT, HTTPSTATUS.BAD_REQUEST);
    }
    const chat = await this._chatService.getOrCreateChat({
      creatorId,
      creatorRole: role,
      participantId,
    });
    res.status(HTTPSTATUS.CREATED).json(new ApiResponse(chat));
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
