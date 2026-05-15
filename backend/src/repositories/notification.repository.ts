import { injectable } from "inversify";
import { FilterQuery, Types } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import type { INotificationRepository } from "@/core/interfaces/repositories/INotificationRepository";
import Notification from "@/models/notification.model";
import { CursorPaginatedResult } from "@/types/common/pagination";
import type { INotification } from "@/types/notification/notification.entity";
import { NotificationListQuery } from "@/types/notification/notification.query";

@injectable()
export class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor() {
    super(Notification);
  }

  async getNotifications(
    filter: NotificationListQuery
  ): Promise<CursorPaginatedResult<INotification>> {
    const { limit, recipientId, cursor, read } = filter;

    const andConditions: FilterQuery<INotification>[] = [];
    const query: FilterQuery<INotification> = {
      recipientId: new Types.ObjectId(recipientId),
    };
    if (read !== undefined) {
      query.read = read;
    }

    if (cursor) {
      andConditions.push({
        $or: [
          { createdAt: { $lt: new Date(cursor.createdAt) } },
          {
            createdAt: new Date(cursor.createdAt),
            _id: { $lt: new Types.ObjectId(cursor._id) },
          },
        ],
      });
    }
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const docs = await this.model
      .find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean<INotification[]>();

    let nextCursor: string | null = null;
    if (docs.length > limit) {
      docs.pop();
      const lastItem = docs[docs.length - 1];

      nextCursor = Buffer.from(
        JSON.stringify({
          createdAt: lastItem.createdAt.toISOString(),
          _id: lastItem._id.toString(),
        })
      ).toString("base64url");
    }
    return {
      data: docs,
      nextCursor: nextCursor,
    };
  }

  async markAsRead(id: string): Promise<INotification | null> {
    return this.model.findOneAndUpdate(
      { _id: new Types.ObjectId(id), read: false },
      { read: true },
      { new: true }
    );
  }

  async markAllAsRead(recipientId: string): Promise<number> {
    const filter: FilterQuery<INotification> = {
      read: false,
      recipientId: new Types.ObjectId(recipientId),
    };
    const result = await this.model.updateMany(filter, { read: true });
    return result.modifiedCount;
  }
}
