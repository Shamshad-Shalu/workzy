import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import logger from "@/config/logger";
import { HTTPSTATUS } from "@/constants";
import type { INotificationRepository } from "@/core/interfaces/repositories/INotificationRepository";
import type { INotificationService } from "@/core/interfaces/services/INotificationService";
import { TYPES } from "@/di/types";
import { NotificationResponseDto } from "@/dtos/responses/notification.dto";
import { getIO } from "@/socket/socket";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { INotification } from "@/types/notification/notification.entity";
import { NotificationListQuery } from "@/types/notification/notification.query";
import CustomError from "@/utils/customError";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository) private _notificationRepo: INotificationRepository
  ) {}

  async createNotification(
    recipientId: string,
    data: { type: string; heading: string; message: string }
  ): Promise<void> {
    try {
      await this._notificationRepo.create({
        type: data.type,
        recipientId: new Types.ObjectId(recipientId),
        heading: data.heading,
        message: data.message,
        read: false,
      } as never);
      const io = getIO();
      const unreadCount = await this._notificationRepo
        .getNotifications({ limit: 12, recipientId, read: false })
        .then((n) => n.data.length);
      io.to(recipientId).emit("new_notification", {
        heading: data.heading,
        message: data.message,
        unreadCount,
      });
    } catch (err) {
      console.error("Notification creation/emission failed:", err);
      logger.warn(`Notification skipped (${data.type})`, err);
    }
  }

  async getNotifications(
    input: NotificationListQuery
  ): Promise<CursorPaginatedResult<NotificationResponseDto>> {
    const { data, nextCursor } = await this._notificationRepo.getNotifications(input);
    return {
      data: NotificationResponseDto.fromEntities(data),
      nextCursor,
    };
  }

  async markAsRead(id: string): Promise<INotification> {
    const updated = await this._notificationRepo.markAsRead(id);
    if (!updated) {
      throw new CustomError("Notification not found or already read", HTTPSTATUS.NOT_FOUND);
    }
    return updated;
  }

  async markAllAsRead(recipientId: string): Promise<number> {
    return this._notificationRepo.markAllAsRead(recipientId);
  }
}
