import mongoose, { Schema } from "mongoose";

import { IChat } from "@/types/chat/chat.entity";

const ChatSchema = new Schema<IChat>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

ChatSchema.index({ bookingId: 1 });
ChatSchema.index({ userId: 1, workerId: 1 });
ChatSchema.index({ createdAt: 1 });
ChatSchema.index({ isActive: 1 });

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
