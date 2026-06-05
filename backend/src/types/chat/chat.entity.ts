import { Document, Types } from "mongoose";

export interface IChat extends Document<string> {
  chatId: string;
  bookingId: Types.ObjectId;
  userId: Types.ObjectId;
  workerId: Types.ObjectId;
  isActive: boolean;
  searchText: string;
  createdAt: Date;
  updatedAt: Date;
}
