import mongoose, { Schema } from "mongoose";

import { IPlan } from "@/types/plan";

const PlanPriceSchema = new Schema(
  {
    monthly: { type: Number, required: true, min: 1 },
    quarterly: { type: Number, min: 1, default: undefined },
    halfYearly: { type: Number, min: 1, default: undefined },
    yearly: { type: Number, min: 1, default: undefined },
  },
  { _id: false }
);

const PlanSchema: Schema<IPlan> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: PlanPriceSchema,
      required: true,
    },
    isSpecialOffer: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    validFrom: {
      type: Date,
      default: undefined,
    },
    validTill: {
      type: Date,
      default: undefined,
    },
  },
  { timestamps: true }
);

PlanSchema.index({ isActive: 1, isSpecialOffer: 1 });
PlanSchema.index({ isSpecialOffer: 1 });
PlanSchema.index({ isSpecialOffer: 1, isActive: 1, validTill: 1 });

export default mongoose.model<IPlan>("Plan", PlanSchema);
