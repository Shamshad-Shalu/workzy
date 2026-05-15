import { NotificationResponseDto } from "@/dtos/responses/notification.dto";
import { CursorPaginatedResult } from "@/types/common/pagination";
import type { INotification } from "@/types/notification/notification.entity";
import { NotificationListQuery } from "@/types/notification/notification.query";

export interface INotificationService {
  createNotification(
    recipientId: string,
    data: { type: string; heading: string; message: string }
  ): Promise<void>;

  getNotifications(
    input: NotificationListQuery
  ): Promise<CursorPaginatedResult<NotificationResponseDto>>;
  markAsRead(id: string): Promise<INotification>;
  markAllAsRead(recipientId: string): Promise<number>;
}
