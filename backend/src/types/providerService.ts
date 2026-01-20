import { Document, Types } from "mongoose";

export interface BulkDiscountType {
  count: number;
  percent: number;
}

export interface IProviderService extends Document<string> {
  workerId: Types.ObjectId;
  categoryId: Types.ObjectId;
  rate: number;
  description?: string;
  estimatedDuration?: number;
  bufferTime?: number;
  maxTravelRadius: number;
  bulkDiscount?: BulkDiscountType[];
  allowSuddenBooking?: boolean;
  isActive: boolean;
  experience: number;
  maxTravelCost?: number | null;
  createdAt: Date;
}
