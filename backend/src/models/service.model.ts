import { RateType } from "@/types/worker";
import { IService, ServiceJobType } from "@/types/service";
import mongoose, { Schema } from "mongoose";

const ServiceSchema: Schema<IService> = new Schema(
  {
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    rate: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      type: {
        type: String,
        enum: ["hourly", "fixed"] as RateType[],
        required: true,
      },
    },
    description: {
      type: String,
    },
    estimatedDuration: {
      type: String,
    },
    serviceType: {
      type: String,
      enum: ["Small Task", "Major Project", "Consultation"] as ServiceJobType[],
      default: "Small Task",
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ServiceSchema.index({ workerId: 1, serviceId: 1 }, { unique: true });

export default mongoose.model<IService>("Service", ServiceSchema);
