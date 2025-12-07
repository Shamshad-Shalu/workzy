import mongoose, { Document } from "mongoose";

export interface IService extends Document {
  name: string;
  description?: string;
  iconUrl?: string;
  imageUrl?: string;
  parentId?: mongoose.Types.ObjectId | null;
  platformFee: number;
  isAvailable: boolean;
}
