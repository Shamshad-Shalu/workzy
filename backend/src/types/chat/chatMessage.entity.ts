import { Document, Types } from "mongoose";

import { MessageType, SenderRole } from "@/constants";

export interface IChatMessage extends Document<string> {
  bookingId: Types.ObjectId;
  senderId: Types.ObjectId;
  role: SenderRole;
  type: MessageType;
  content?: string;
  mediaUrl?: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
