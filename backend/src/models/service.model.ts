import { IService } from "@/types/service";
import mongoose, { Schema } from "mongoose";

const ServiceSchema: Schema<IService> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    iconUrl: { type: String, default: null },
    imageUrl: { type: String, default: null },
    parentId: { type: Schema.Types.ObjectId, ref: "Services", default: null },
    platformFee: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Services = mongoose.model<IService>("Services", ServiceSchema);
export default Services;
