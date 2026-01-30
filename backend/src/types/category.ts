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
  rateDeviationPercent: number;
  estimatedDuration: number;
  bufferTime?: number;
  travelRatePerKM?: number;
  serviceType?: ServiceType;
  pricingMode?: PricingMode;
  allowBulkOffers?: boolean;
  allowSuddenBooking?: boolean;
  createdAt: Date;
}

export interface CategoryOption {
  id: string;
  name: string;
}

export interface CategoryAncestor {
  _id: string;
  name: string;
  level: 1 | 2 | 3;
  parentId: string | null;
}

export type CategoryLite = Pick<CategoryAncestor, "_id" | "name" | "level">;
export interface CategoryLiteDTO {
  id: string;
  name: string;
  level: 1 | 2 | 3;
}

// category service listing
export type CategorySuggestionEntity = Pick<ICategory, "_id" | "name" | "level" | "iconUrl">;
export interface CategorySuggestion {
  id: string;
  name: string;
  iconUrl: string;
  level: number;
}

export type CategoryTrendingEntity = Pick<ICategory, "_id" | "name" | "level" | "iconUrl">;
