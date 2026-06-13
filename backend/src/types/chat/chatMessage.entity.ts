import { Document, Types } from "mongoose";

import { MessageType, Role, SenderRole } from "@/constants";

export interface IChatMessage extends Document<string> {
  chatId: Types.ObjectId;
  role: Role;
  type: MessageType;
  content?: string;
  mediaUrl?: string;

  bookingId?: Types.ObjectId;
  replyTo?: {
    messageId: Types.ObjectId;
    content?: string;
    type: MessageType;
    role: SenderRole;
  };
  isEdited: boolean;
  readByRoles: SenderRole[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
