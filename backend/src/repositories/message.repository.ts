import { injectable } from "inversify";
import { FilterQuery, Types } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IMessageRepository } from "@/core/interfaces/repositories/IMessageRepository";
import { ChatMessage } from "@/models/chatMessage.model";
import { MessageQuery } from "@/types/chat/chat.query";
import { IChatMessage } from "@/types/chat/chatMessage.entity";
import { CursorPaginatedResult } from "@/types/common/pagination";

@injectable()
export class MessageRepository extends BaseRepository<IChatMessage> implements IMessageRepository {
  constructor() {
    super(ChatMessage);
  }

  async getMessages(filter: MessageQuery): Promise<CursorPaginatedResult<IChatMessage>> {
    const { bookingId, limit, cursor, isDeleted } = filter;

    const andConditions: FilterQuery<IChatMessage>[] = [];
    const query: FilterQuery<IChatMessage> = {
      bookingId: new Types.ObjectId(bookingId),
    };
    if (isDeleted !== undefined) {
      query.isDeleted = isDeleted;
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
      .lean<IChatMessage[]>();

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
}
