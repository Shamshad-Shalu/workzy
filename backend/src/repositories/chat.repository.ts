import { injectable } from "inversify";
import { FilterQuery, Types } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IChatRepository } from "@/core/interfaces/repositories/IChatRepository";
import { Chat } from "@/models/chat.model";
import { IChat } from "@/types/chat/chat.entity";
import { ChatListItem } from "@/types/chat/chat.projection";
import { ChatQuery } from "@/types/chat/chat.query";
import { CursorPaginatedResult } from "@/types/common/pagination";

@injectable()
export class ChatRepository extends BaseRepository<IChat> implements IChatRepository {
  constructor() {
    super(Chat);
  }

  findByBookingId(bookingId: string): Promise<ChatListItem | null> {
    return this.model
      .findOne({ bookingId: new Types.ObjectId(bookingId) })
      .populate("workerId", "profileImage displayName")
      .populate("userId", "profileImage name")
      .populate("bookingId", "bookingId ")
      .lean<ChatListItem>();
  }

  async findByChatId(chatId: string): Promise<ChatListItem | null> {
    return this.model
      .findById(chatId)
      .populate("workerId", "profileImage displayName")
      .populate("userId", "profileImage name")
      .populate("bookingId", "bookingId ")
      .lean<ChatListItem>();
  }

  async getChatRooms(filter: ChatQuery): Promise<CursorPaginatedResult<ChatListItem>> {
    const { userId, workerId, limit, search, cursor, isActive } = filter;

    const andConditions: FilterQuery<IChat>[] = [];
    const query: FilterQuery<IChat> = {};

    if (userId) {
      query.userId = new Types.ObjectId(userId);
    }
    if (workerId) {
      query.workerId = new Types.ObjectId(workerId);
    }
    if (isActive !== undefined) {
      query.isActive = isActive;
    }
    if (search) {
      query.$or = [
        { searchText: { $regex: search, $options: "i" } },
        { chatId: { $regex: search, $options: "i" } },
      ];
    }

    if (cursor) {
      andConditions.push({
        $or: [
          { updatedAt: { $lt: new Date(cursor.updatedAt) } },
          {
            updatedAt: new Date(cursor.updatedAt),
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
      .populate("userId", "profileImage name")
      .populate("workerId", "profileImage displayName")
      .populate("bookingId", "bookingId ")
      .sort({ updatedAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean<ChatListItem[]>();

    let nextCursor: string | null = null;
    if (docs.length > limit) {
      docs.pop();
      const lastItem = docs[docs.length - 1];

      nextCursor = Buffer.from(
        JSON.stringify({
          updatedAt: lastItem.updatedAt.toISOString(),
          _id: lastItem._id.toString(),
        })
      ).toString("base64url");
    }

    return {
      data: docs,
      nextCursor: nextCursor,
    };
  }
}
