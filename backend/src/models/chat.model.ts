import mongoose, { Schema } from "mongoose";

import { MESSAGE_TYPE_VALUES, ROLE_VALUES } from "@/constants";
import { IChat } from "@/types/chat/chat.entity";
import { generateTxnCode } from "@/utils/generateTxnCode";

const ChatSchema = new Schema<IChat>(
  {
    chatId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      default: () => generateTxnCode("CHT"),
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
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
    searchText: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastMessage: {
      _id: false,
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
      content: { type: String },
      createdAt: { type: Date },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

ChatSchema.index({ userId: 1, isActive: 1, updatedAt: -1 });
ChatSchema.index({ workerId: 1, isActive: 1, updatedAt: -1 });
ChatSchema.index({ updatedAt: -1, _id: -1 });

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
