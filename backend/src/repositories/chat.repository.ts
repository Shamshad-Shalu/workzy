import { injectable } from "inversify";
import { FilterQuery, PipelineStage, Types } from "mongoose";

import { HTTPSTATUS, ROLE } from "@/constants";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { IChatRepository } from "@/core/interfaces/repositories/IChatRepository";
import { Chat } from "@/models/chat.model";
import { IChat } from "@/types/chat/chat.entity";
import { ChatListItem } from "@/types/chat/chat.projection";
import { ChatQuery } from "@/types/chat/chat.query";
import { CursorPaginatedResult } from "@/types/common/pagination";
import CustomError from "@/utils/customError";

@injectable()
export class ChatRepository extends BaseRepository<IChat> implements IChatRepository {
  constructor() {
    super(Chat);
  }

  async findByParticipants(userId: string, workerId: string): Promise<ChatListItem | null> {
    return await this.model
      .findOne({
        userId: new Types.ObjectId(userId),
        workerId: new Types.ObjectId(workerId),
      })
      .populate("userId", "name profileImage")
      .populate("workerId", "displayName profileImage")
      .lean<ChatListItem>();
  }

  async findByChatId(chatId: string): Promise<ChatListItem | null> {
    if (!Types.ObjectId.isValid(chatId)) {
      throw new CustomError("Invalid chat ID format.", HTTPSTATUS.BAD_REQUEST);
    }
    const chat = this.model
      .findById(chatId)
      .populate("workerId", "profileImage displayName")
      .populate("userId", "profileImage name")
      .lean<ChatListItem>();
    if (!chat) {
      throw new CustomError("Chat not found.", HTTPSTATUS.NOT_FOUND);
    }
    return chat;
  }

  async getChatRooms(filter: ChatQuery): Promise<CursorPaginatedResult<ChatListItem>> {
    if (filter.search?.trim()) {
      return this.searchChatRooms(filter);
    }
    const { limit } = filter;
    const query = this.buildMatchStage(filter);
    const docs = await this.model
      .find(query)
      .populate("userId", "profileImage name")
      .populate("workerId", "profileImage displayName")
      .sort({ updatedAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean<ChatListItem[]>();

    const nextCursor = this.buildNextCursor(docs, limit);

    return {
      data: docs,
      nextCursor,
    };
  }

  private async searchChatRooms(filter: ChatQuery): Promise<CursorPaginatedResult<ChatListItem>> {
    const { limit, search = "", role } = filter;

    type ChatSearchFields = {
      chatId: string;
      "user.name": string;
      "worker.displayName": string;
    };

    const searchConditions: FilterQuery<ChatSearchFields>[] = [
      {
        chatId: { $regex: search, $options: "i" },
      },
    ];

    if (role === ROLE.ADMIN) {
      searchConditions.push(
        { "user.name": { $regex: search, $options: "i" } },
        { "worker.displayName": { $regex: search, $options: "i" } }
      );
    }

    if (role === ROLE.WORKER) {
      searchConditions.push({
        "user.name": { $regex: search, $options: "i" },
      });
    }

    if (role === ROLE.USER) {
      searchConditions.push({
        "worker.displayName": { $regex: search, $options: "i" },
      });
    }

    const pipeline: PipelineStage[] = [
      {
        $match: this.buildMatchStage(filter),
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                name: 1,
                profileImage: 1,
              },
            },
          ],
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      {
        $lookup: {
          from: "workers",
          localField: "workerId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                displayName: 1,
                profileImage: 1,
              },
            },
          ],
          as: "worker",
        },
      },

      {
        $unwind: "$worker",
      },

      {
        $match: {
          $or: searchConditions,
        },
      },

      {
        $addFields: {
          userId: "$user",
          workerId: "$worker",
        },
      },

      {
        $project: {
          user: 0,
          worker: 0,
        },
      },

      {
        $sort: {
          updatedAt: -1,
          _id: -1,
        },
      },

      {
        $limit: limit + 1,
      },
    ];

    const docs = await this.model.aggregate<ChatListItem>(pipeline);

    const nextCursor = this.buildNextCursor(docs, limit);

    return {
      data: docs,
      nextCursor,
    };
  }

  private buildMatchStage(filter: ChatQuery): Record<string, unknown> {
    const { userId, workerId, cursor } = filter;

    const matchStage: Record<string, unknown> = {};

    if (userId) {
      matchStage.userId = new Types.ObjectId(userId);
    }

    if (workerId) {
      matchStage.workerId = new Types.ObjectId(workerId);
    }

    if (cursor) {
      matchStage.$or = [
        {
          updatedAt: {
            $lt: new Date(cursor.updatedAt),
          },
        },
        {
          updatedAt: new Date(cursor.updatedAt),
          _id: {
            $lt: new Types.ObjectId(cursor._id),
          },
        },
      ];
    }

    return matchStage;
  }

  private buildNextCursor(docs: ChatListItem[], limit: number): string | null {
    if (docs.length <= limit) {
      return null;
    }
    docs.pop();

    const lastItem = docs[docs.length - 1];

    return Buffer.from(
      JSON.stringify({
        updatedAt: lastItem.updatedAt.toISOString(),
        _id: lastItem._id.toString(),
      })
    ).toString("base64url");
  }
}
