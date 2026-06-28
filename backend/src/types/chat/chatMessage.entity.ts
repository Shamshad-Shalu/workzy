import { Document, Types } from "mongoose";

import { MessageType, Role, SenderRole } from "@/constants";

export interface IMessageReplySnapshot {
  messageId: Types.ObjectId;
  content?: string;
  type: MessageType;
  role: SenderRole;
}

export interface IChatMessage extends Document<string> {
  chatId: Types.ObjectId;
  role: Role;
  type: MessageType;
  content?: string;
  mediaUrl?: string;

  bookingId?: Types.ObjectId;
  replyTo?: IMessageReplySnapshot;

  isEdited: boolean;
  readByRoles: SenderRole[];
  deliveredToRoles: SenderRole[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
