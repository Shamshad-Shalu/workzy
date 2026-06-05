import { Document, Types } from "mongoose";

import { MessageType, SenderRole } from "@/constants";

export interface IChatMessage extends Document<string> {
  chatId: Types.ObjectId;
  role: SenderRole;
  type: MessageType;
  content?: string;
  mediaUrl?: string;
  readByRoles: SenderRole[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
