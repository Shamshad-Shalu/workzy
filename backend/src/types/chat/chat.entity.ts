import { Document, Types } from "mongoose";

import { MessageType, SenderRole } from "@/constants";

export interface IChat extends Document<string> {
  chatId: string;
  bookingId: Types.ObjectId;
  userId: Types.ObjectId;
  workerId: Types.ObjectId;
  isActive: boolean;
  searchText: string;
  lastMessage?: {
    type: MessageType;
    role: SenderRole;
    content?: string;
    createdAt: Date;
    isDeleted: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
