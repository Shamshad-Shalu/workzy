import { Document, Types } from "mongoose";

import { QuoteStatus } from "@/constants";

export interface IQuote extends Document<string> {
  workerId: Types.ObjectId;
  userId: Types.ObjectId;
  serviceId: Types.ObjectId;
  slotIds: Types.ObjectId[];
  startTime: string;
  endTime: string;
  dates: Date[]; // all days this quote covers
  totalPrice: number;
  message?: string; // worker note to user
  status: QuoteStatus;
  expiresAt: Date;
  createdAt: Date;
}
