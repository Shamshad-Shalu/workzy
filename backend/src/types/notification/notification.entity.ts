import { Document, Types } from "mongoose";

export interface INotification extends Document<string> {
  type: string;
  recipientId: Types.ObjectId;
  heading: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
