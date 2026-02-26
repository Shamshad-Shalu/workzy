import mongoose, { Schema } from "mongoose";

import { IService } from "@/types/service";

const ServiceSchema: Schema<IService> = new Schema(
  {
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    rate: { type: Number, required: true },
    description: { type: String },
    estimatedDuration: { type: Number },
    bufferTime: { type: Number },
    maxTravelRadius: { type: Number, default: 20 },
    bulkDiscounts: {
      type: [
        {
          _id: false,
          count: { type: Number, required: true },
          percent: { type: Number, required: true },
        },
      ],
      default: undefined,
    },
    allowSuddenBooking: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    experience: { type: Number, default: 0 },
    maxTravelCost: { type: Number, default: null },
  },
  { timestamps: true }
);

ServiceSchema.index({ workerId: 1, categoryId: 1 }, { unique: true });

ServiceSchema.index({ categoryId: 1, isActive: 1 });

export default mongoose.model<IService>("Service", ServiceSchema);
