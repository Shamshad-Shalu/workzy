import mongoose, { Schema } from "mongoose";

import { MESSAGE_TYPE_VALUES, SENDER_ROLE_VALUES } from "@/constants/chat";
import { IChatMessage } from "@/types/chat/chatMessage.entity";

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: SENDER_ROLE_VALUES,
      required: true,
    },
    type: {
      type: String,
      enum: MESSAGE_TYPE_VALUES,
      required: true,
    },
    content: {
      type: String,
      validate: {
        validator: function (v: string | undefined) {
          if (this.type === "text" && !v) return false;
          if (this.type !== "text") return true;
          return v !== undefined;
        },
        message: "Text messages must have content",
      },
    },
    mediaUrl: {
      type: String,
      validate: {
        validator: function (v: string | undefined) {
          if (["audio", "video", "image"].includes(this.type) && !v) return false;
          return true;
        },
        message: "Media messages must have mediaUrl",
      },
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ChatMessageSchema.index({ bookingId: 1, createdAt: -1 });
ChatMessageSchema.index({ senderId: 1 });
ChatMessageSchema.index({ createdAt: 1 });

export const ChatMessage = mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
