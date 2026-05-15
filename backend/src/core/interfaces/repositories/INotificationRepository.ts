import { CursorPaginatedResult } from "@/types/common/pagination";
import type { INotification } from "@/types/notification/notification.entity";
import { NotificationListQuery } from "@/types/notification/notification.query";

import type { IBaseRepository } from "./IBaseRepository";

export interface INotificationRepository extends IBaseRepository<INotification> {
  getNotifications(filter: NotificationListQuery): Promise<CursorPaginatedResult<INotification>>;
  markAllAsRead(recipientId: string): Promise<number>;
  markAsRead(id: string): Promise<INotification | null>;
}
