import mongoose, { Document } from "mongoose";

import { DocumentType, PricingMode, ServiceType } from "@/constants";

export interface ICategory extends Document<string> {
  name: string;
  description: string;
  iconUrl: string;
  imageUrl: string;
  level: number;
  parentId?: mongoose.Types.ObjectId | null;
  platformFee: number;
  isAvailable: boolean;

  requiredDocuments?: DocumentType[];

  baseRate: number;
  priceVarianceLimit: number;
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

export type CategoryAncestorEntity = Pick<ICategory, "_id" | "name" | "parentId" | "level">;
export type CategoryLevelsEntity = Pick<ICategory, "_id" | "name" | "iconUrl" | "level">;
export type CategorySuggestionEntity = Pick<
  ICategory,
  "_id" | "name" | "iconUrl" | "parentId" | "level"
>;
export type CategoryTrendingEntity = Pick<
  ICategory,
  "_id" | "name" | "iconUrl" | "parentId" | "level"
>;

export type SubServiceEntity = Pick<ICategory, "_id" | "name">;
export type ServiceItemEntity = Pick<
  ICategory,
  "_id" | "name" | "description" | "iconUrl" | "imageUrl" | "baseRate"
> & {
  subServices: SubServiceEntity[];
};

export type ServiceSort = "price_asc" | "price_desc" | "newest" | "popular";
export type CategoryListEntity = Pick<
  ICategory,
  "_id" | "name" | "description" | "iconUrl" | "imageUrl" | "baseRate" | "parentId" | "createdAt"
>;
export type PublicCategoriesParams = {
  categoryId?: string;
  sortBy?: ServiceSort;
  limit: number;
  cursor?: string;
};
