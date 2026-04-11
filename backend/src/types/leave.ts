import { Types } from "mongoose";
import { Document } from "mongoose";

export interface ILeave extends Document<string> {
  workerId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  reason?: string;
  createdAt: Date;
}
