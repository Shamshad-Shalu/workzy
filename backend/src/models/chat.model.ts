import mongoose, { Schema } from "mongoose";

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
  },
  {
    timestamps: true,
  }
);

ChatSchema.index({ userId: 1, isActive: 1, updatedAt: -1 });
ChatSchema.index({ workerId: 1, isActive: 1, updatedAt: -1 });
ChatSchema.index({ updatedAt: -1, _id: -1 });

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
