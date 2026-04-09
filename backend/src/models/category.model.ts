import mongoose, { Schema } from "mongoose";

import { PRICING_MODE_VALUES, SERVICE_TYPE_VALUES } from "@/constants";
import { ICategory } from "@/types/category";

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    iconUrl: { type: String, default: null },
    imageUrl: { type: String, default: null },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    level: {
      type: Number,
      enum: [1, 2],
      default: 1,
    },
    platformFee: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    baseRate: { type: Number, required: true, min: 50 },
    priceVarianceLimit: { type: Number, min: 0, max: 100 },

    estimatedDuration: { type: Number },
    bufferTime: { type: Number },
    travelRatePerKM: { type: Number, min: 0 },
    serviceType: {
      type: String,
      enum: SERVICE_TYPE_VALUES,
    },
    pricingMode: {
      type: String,
      enum: PRICING_MODE_VALUES,
    },
    allowBulkOffers: { type: Boolean },
    allowSuddenBooking: { type: Boolean },
  },
  { timestamps: true }
);

CategorySchema.index({ name: 1, parentId: 1 }, { unique: true });
CategorySchema.index({ level: 1, isAvailable: 1 });
CategorySchema.index({ parentId: 1, level: 1 });
CategorySchema.index({ level: 1, isAvailable: 1, parentId: 1, createdAt: -1, _id: -1 });
CategorySchema.index({ level: 1, isAvailable: 1, parentId: 1, baseRate: 1, _id: 1 });
CategorySchema.index({ name: "text" });

const Category = mongoose.model<ICategory>("Category", CategorySchema);
export default Category;
