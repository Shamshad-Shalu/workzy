import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, HTTPSTATUS } from "@/constants";
import type { INotificationController } from "@/core/interfaces/controllers/INotificationController";
import type { INotificationService } from "@/core/interfaces/services/INotificationService";
import { TYPES } from "@/di/types";
import { NotificationListQuery } from "@/types/notification/notification.query";
import { ApiResponse } from "@/utils/apiResponse";
import CustomError from "@/utils/customError";

import type { Request, Response } from "express";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.NotificationService) private _notificationService: INotificationService
  ) {}

  getNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const recipient =
      (req.query.type as string | undefined) === "WORKER" ? req.user?.workerId : req.user?.id;

    if (!recipient) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    const params = this.parseQuery(req);
    const { data, nextCursor } = await this._notificationService.getNotifications({
      recipientId: recipient,
      ...params,
    });
    res.status(HTTPSTATUS.OK).json(new ApiResponse({ notifications: data, nextCursor }));
  });

  markAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const notification = await this._notificationService.markAsRead(id);
    res.status(HTTPSTATUS.OK).json(new ApiResponse(notification));
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const recipient =
      (req.query.type as string | undefined) === "WORKER" ? req.user?.workerId : req.user?.id;

    if (!recipient) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }

    const modifiedCount = await this._notificationService.markAllAsRead(recipient);
    res.status(HTTPSTATUS.OK).json(new ApiResponse({ modifiedCount }));
  });

  private parseQuery(req: Request): Omit<NotificationListQuery, "recipientId"> {
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 50);
    const read = req.query.read as string | undefined;

    const parsedCursor = req.query.cursor
      ? JSON.parse(Buffer.from(req.query.cursor as string, "base64url").toString("utf8"))
      : undefined;

    return {
      limit,
      cursor: parsedCursor,
      read: read !== undefined ? read === "true" : undefined,
    };
  }
}
