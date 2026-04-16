import { Document, Types } from "mongoose";

import { QuoteStatus } from "@/constants";

import { IBookingSlot } from "./booking";

export interface IQuote extends Document<string> {
  workerId: Types.ObjectId;
  userId: Types.ObjectId;
  serviceId: Types.ObjectId;
  slotIds: Types.ObjectId[];
  dates: IBookingSlot[];
  totalPrice: number;
  message?: string; // worker note to user
  status: QuoteStatus;
  expiresAt: Date;
  createdAt: Date;
}
