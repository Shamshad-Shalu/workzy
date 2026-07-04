import { Types } from "mongoose";

import { IChat } from "./chat.entity";

export type ChatListItem = Pick<
  IChat,
  "_id" | "chatId" | "isBlocked" | "blockedBy" | "lastMessage" | "createdAt" | "updatedAt"
> & {
  workerId: {
    _id: Types.ObjectId;
    displayName: string;
    profileImage?: string;
  };
  userId: {
    _id: Types.ObjectId;
    name: string;
    profileImage?: string;
  };
};

export interface UnreadCountResult {
  _id: Types.ObjectId;
  count: number;
}
