import { PricingMode, ServiceType } from "@/constants";
import mongoose, { Document } from "mongoose";

export interface ICategory extends Document<string> {
  name: string;
  description: string;
  iconUrl: string;
  imageUrl: string;
  level: number;
  parentId?: mongoose.Types.ObjectId | null;
  platformFee: number;
  isAvailable: boolean;

  baseRate: number;
  rateDeviationPercent?: number;
  estimatedDuration: number;
  bufferTime?: number;
  travelRatePerKM?: number;
  serviceType?: ServiceType;
  pricingMode?: PricingMode;
  allowBulkOffers?: boolean;
  allowSuddenBooking?: boolean;
  createdAt: Date;
}
