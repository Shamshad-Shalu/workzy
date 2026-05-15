import { model, Schema } from "mongoose";

import type { INotification } from "@/types/notification/notification.entity";

const NotificationSchema: Schema<INotification> = new Schema(
  {
    type: {
      type: String,
      required: true,
      index: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 600,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

NotificationSchema.index({ recipientId: 1, recipientRole: 1, createdAt: -1, _id: -1 });

const Notification = model<INotification>("Notification", NotificationSchema);
export default Notification;
