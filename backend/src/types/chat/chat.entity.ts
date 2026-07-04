import { Document, Types } from "mongoose";

import { MessageType, SenderRole } from "@/constants";

export interface IChat extends Document<string> {
  chatId: string;
  userId: Types.ObjectId;
  workerId: Types.ObjectId;
  isBlocked: boolean;
  blockedBy?: SenderRole;
  lastMessage?: {
    messageId: Types.ObjectId;
    type: MessageType;
    role: SenderRole;
    content?: string;
    createdAt: Date;
    isDeleted: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
