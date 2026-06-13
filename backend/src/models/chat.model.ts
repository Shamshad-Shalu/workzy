import mongoose, { Schema } from "mongoose";

import { MESSAGE_TYPE_VALUES, ROLE_VALUES, SENDER_ROLE_VALUES } from "@/constants";
import { IChat } from "@/types/chat/chat.entity";
import { generateTxnCode } from "@/utils/generateTxnCode";

const LastMessageSchema = new Schema(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
    type: {
      type: String,
      enum: MESSAGE_TYPE_VALUES,
    },
    role: {
      type: String,
      enum: ROLE_VALUES,
    },
    content: String,
    createdAt: Date,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const ChatSchema = new Schema<IChat>(
  {
    chatId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      default: () => generateTxnCode("CHT"),
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedBy: {
      type: String,
      enum: SENDER_ROLE_VALUES,
      default: null,
    },
    lastMessage: {
      type: LastMessageSchema,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

ChatSchema.index({ userId: 1, workerId: 1 }, { unique: true });
ChatSchema.index({ userId: 1, updatedAt: -1 });
ChatSchema.index({ workerId: 1, updatedAt: -1 });
ChatSchema.index({ updatedAt: -1, _id: -1 });

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
