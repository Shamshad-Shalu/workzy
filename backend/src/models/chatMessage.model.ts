import mongoose, { Schema } from "mongoose";

import { ROLE_VALUES } from "@/constants";
import { MESSAGE_TYPE_VALUES, SENDER_ROLE_VALUES } from "@/constants/chat";
import { IChatMessage } from "@/types/chat/chatMessage.entity";

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    role: {
      type: String,
      enum: ROLE_VALUES,
      required: true,
    },
    type: {
      type: String,
      enum: MESSAGE_TYPE_VALUES,
      required: true,
    },
    content: {
      type: String,
      trim: true,
      validate: {
        validator: function (this: IChatMessage, value?: string) {
          if (this.type === "text") {
            return !!value?.trim();
          }
          return true;
        },
        message: "Text messages must have content",
      },
    },
    mediaUrl: {
      type: String,
      validate: {
        validator: function (this: IChatMessage, value?: string) {
          if (["audio", "video", "image"].includes(this.type)) {
            return !!value;
          }
          return true;
        },
        message: "Media messages must have mediaUrl",
      },
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    replyTo: {
      _id: false,
      messageId: {
        type: Schema.Types.ObjectId,
        ref: "ChatMessage",
      },
      content: { type: String },
      type: { type: String, enum: MESSAGE_TYPE_VALUES },
      role: { type: String, enum: SENDER_ROLE_VALUES },
    },

    isEdited: {
      type: Boolean,
      default: false,
    },
    readByRoles: {
      type: [{ type: String, enum: SENDER_ROLE_VALUES }],
      default: [],
    },
    deliveredToRoles: { type: [String], enum: SENDER_ROLE_VALUES, default: [] },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ChatMessageSchema.index({ chatId: 1, isDeleted: 1, createdAt: -1, _id: -1 });

export const ChatMessage = mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
