import { Types } from "mongoose";

import { IChat } from "./chat.entity";
import { IChatMessage } from "./chatMessage.entity";

export type ChatListItem = Pick<
  IChat,
  "_id" | "chatId" | "isActive" | "updatedAt" | "createdAt"
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
  bookingId: {
    _id: Types.ObjectId;
    bookingId: string;
  };
};

export interface LatestMessageResult {
  _id: Types.ObjectId;
  message: IChatMessage;
}

export interface UnreadCountResult {
  _id: Types.ObjectId;
  count: number;
}
