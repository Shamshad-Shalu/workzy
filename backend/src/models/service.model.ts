import { IService } from "@/types/service";
import mongoose, { Schema } from "mongoose";

const ServiceSchema = new Schema<IService>(
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

export default mongoose.model<IService>("Services", ServiceSchema);
