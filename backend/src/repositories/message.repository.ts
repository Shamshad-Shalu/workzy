import { injectable } from "inversify";
import { FilterQuery, Types } from "mongoose";

import { SenderRole } from "@/constants";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { IMessageRepository } from "@/core/interfaces/repositories/IMessageRepository";
import { ChatMessage } from "@/models/chatMessage.model";
import { UnreadCountResult } from "@/types/chat/chat.projection";
import { MessageQuery } from "@/types/chat/chat.query";
import { IChatMessage } from "@/types/chat/chatMessage.entity";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { Cursor } from "@/types/common/query";

@injectable()
export class MessageRepository extends BaseRepository<IChatMessage> implements IMessageRepository {
  constructor() {
    super(ChatMessage);
  }

  async getMessages(filter: MessageQuery): Promise<CursorPaginatedResult<IChatMessage>> {
    const { chatId, limit, cursor, search, messageId, direction = "older" } = filter;

    const baseQuery: FilterQuery<IChatMessage> = {
      chatId: new Types.ObjectId(chatId),
    };
    if (search?.trim()) {
      baseQuery.content = { $regex: search.trim(), $options: "i" };
      baseQuery.isDeleted = false;
    }

    if (direction === "around") {
      if (!messageId) return { data: [], nextCursor: null, prevCursor: null };

      const pivot = await this.model
        .findOne({
          _id: new Types.ObjectId(messageId),
          chatId: new Types.ObjectId(chatId),
        })
        .select("createdAt _id")
        .lean<IChatMessage>();

      if (!pivot) return { data: [], nextCursor: null, prevCursor: null };

      const pivotDate = pivot.createdAt;
      const pivotId = pivot._id as unknown as Types.ObjectId;

      const before = await this.model
        .find({
          ...baseQuery,
          $or: [
            { createdAt: { $lt: pivotDate } },
            {
              createdAt: pivotDate,
              _id: { $lte: pivotId },
            },
          ],
        })
        .sort({ createdAt: -1, _id: -1 })
        .limit(limit + 1)
        .lean<IChatMessage[]>();

      const hasOlderPage = before.length > limit;
      if (hasOlderPage) before.pop();

      const after = await this.model
        .find({
          ...baseQuery,
          $or: [
            { createdAt: { $gt: pivotDate } },
            {
              createdAt: pivotDate,
              _id: { $gt: pivotId },
            },
          ],
        })
        .sort({ createdAt: 1, _id: 1 })
        .limit(limit + 1)
        .lean<IChatMessage[]>();

      const hasNewerPage = after.length > limit;
      if (hasNewerPage) after.pop();

      const merged: IChatMessage[] = [...after.reverse(), ...before];

      if (merged.length === 0) return { data: [], nextCursor: null, prevCursor: null };

      const prevCursor = hasNewerPage ? this.encodeCursor(merged[0]) : null;
      const nextCursor = hasOlderPage ? this.encodeCursor(merged[merged.length - 1]) : null;

      return { data: merged, nextCursor, prevCursor };
    }

    if (direction === "newer") {
      let resolvedCursor: Cursor | null = cursor ?? null;

      if (messageId && !cursor) {
        const target = await this.model
          .findOne({
            _id: new Types.ObjectId(messageId),
            chatId: new Types.ObjectId(chatId),
          })
          .select("createdAt _id")
          .lean<IChatMessage>();

        if (target) {
          resolvedCursor = {
            createdAt: target.createdAt,
            _id: target._id.toString(),
          };
        }
      }
      if (!resolvedCursor) return { data: [], nextCursor: null, prevCursor: null };

      const docs = await this.model
        .find({
          ...baseQuery,
          $or: [
            { createdAt: { $gt: resolvedCursor.createdAt } },
            {
              createdAt: resolvedCursor.createdAt,
              _id: { $gt: new Types.ObjectId(resolvedCursor._id) },
            },
          ],
        })
        .sort({ createdAt: 1, _id: 1 })
        .limit(limit + 1)
        .lean<IChatMessage[]>();

      let prevCursor: string | null = null;
      if (docs.length > limit) {
        docs.pop();
        prevCursor = this.encodeCursor(docs[docs.length - 1]);
      }
      docs.reverse();

      const nextCursor = docs.length > 0 ? this.encodeCursor(docs[docs.length - 1]) : null;

      return { data: docs, nextCursor, prevCursor };
    }

    let resolvedCursor: Cursor | null = cursor ?? null;

    if (messageId && !cursor) {
      const target = await this.model
        .findOne({
          _id: new Types.ObjectId(messageId),
          chatId: new Types.ObjectId(chatId),
        })
        .select("createdAt _id")
        .lean<IChatMessage>();
      if (target) {
        resolvedCursor = { createdAt: target.createdAt, _id: target._id.toString() };
      }
    }

    const andConditions: FilterQuery<IChatMessage>[] = [];
    if (resolvedCursor) {
      if (cursor) {
        andConditions.push({
          $or: [
            { createdAt: { $lt: resolvedCursor.createdAt } },
            {
              createdAt: resolvedCursor.createdAt,
              _id: { $lt: new Types.ObjectId(resolvedCursor._id) },
            },
          ],
        });
      } else {
        andConditions.push({
          $or: [
            { createdAt: { $lt: resolvedCursor.createdAt } },
            {
              createdAt: resolvedCursor.createdAt,
              _id: { $lte: new Types.ObjectId(resolvedCursor._id) },
            },
          ],
        });
      }
    }
    if (andConditions.length > 0) {
      baseQuery.$and = andConditions;
    }

    const docs = await this.model
      .find(baseQuery)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean<IChatMessage[]>();

    let nextCursor: string | null = null;
    if (docs.length > limit) {
      docs.pop();
      nextCursor = this.encodeCursor(docs[docs.length - 1]);
    }

    const prevCursor = resolvedCursor && docs.length > 0 ? this.encodeCursor(docs[0]) : null;

    return { data: docs, nextCursor, prevCursor };
  }

  async getUnreadCounts(chatIds: string[], role: SenderRole): Promise<UnreadCountResult[]> {
    return this.model.aggregate<UnreadCountResult>([
      {
        $match: {
          chatId: { $in: chatIds.map((id) => new Types.ObjectId(id)) },
          isDeleted: false,
          role: { $ne: role },
          readByRoles: { $ne: role },
        },
      },
      {
        $group: {
          _id: "$chatId",
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async markMessageAsDelivered(messageId: string, role: SenderRole): Promise<IChatMessage | null> {
    return await this.model.findOneAndUpdate(
      {
        _id: new Types.ObjectId(messageId),
        deliveredToRoles: { $ne: role },
      },
      {
        $addToSet: { deliveredToRoles: role },
      },
      { new: true }
    );
  }

  async markRoomMessagesAsDelivered(chatId: string, role: SenderRole): Promise<number> {
    const result = await this.model.updateMany(
      {
        chatId: new Types.ObjectId(chatId),
        role: { $ne: role },
        deliveredToRoles: { $ne: role },
        isDeleted: false,
      },
      {
        $addToSet: { deliveredToRoles: role },
      }
    );
    return result.modifiedCount;
  }

  async markRoomMessagesAsRead(chatId: string, role: SenderRole): Promise<number> {
    const result = await this.model.updateMany(
      {
        chatId: new Types.ObjectId(chatId),
        role: { $ne: role },
        readByRoles: { $ne: role },
        isDeleted: false,
      },
      {
        $addToSet: { readByRoles: role },
      }
    );
    return result.modifiedCount;
  }

  private encodeCursor(doc: IChatMessage): string {
    return Buffer.from(
      JSON.stringify({
        createdAt: doc.createdAt.toISOString(),
        _id: doc._id.toString(),
      })
    ).toString("base64url");
  }
}
