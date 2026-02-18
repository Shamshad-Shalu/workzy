import mongoose, { Document } from "mongoose";

import { PricingMode, ServiceType } from "@/constants";

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

export type CategoryAncestorEntity = Pick<ICategory, "_id" | "name" | "level" | "parentId">;
export type CategoryLevelsEntity = Pick<ICategory, "_id" | "name" | "level" | "iconUrl">;
export type CategorySuggestionEntity = Pick<
  ICategory,
  "_id" | "name" | "level" | "iconUrl" | "parentId"
>;
export type CategoryTrendingEntity = Pick<
  ICategory,
  "_id" | "name" | "level" | "iconUrl" | "parentId"
>;

export type SubServiceEntity = Pick<ICategory, "_id" | "name">;
export type ServiceItemEntity = Pick<
  ICategory,
  "_id" | "name" | "description" | "iconUrl" | "imageUrl"
> & {
  subServices: SubServiceEntity[];
};
