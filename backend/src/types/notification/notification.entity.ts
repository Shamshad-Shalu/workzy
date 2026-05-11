import { Document, Types } from "mongoose";

import type { INotificationType } from "./notificationType.entity";

export interface INotification extends Document<string> {
  notificationTypeId: Types.ObjectId;
  recipientId: Types.ObjectId;
  heading: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface INotificationPopulated extends Omit<INotification, "notificationTypeId"> {
  notificationTypeId: Pick<INotificationType, "_id" | "name" | "icon" | "iconColor">;
}
