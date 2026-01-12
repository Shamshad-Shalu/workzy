import { ICategory } from "@/types/category";
import mongoose, { Schema } from "mongoose";

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    iconUrl: { type: String, default: null },
    imageUrl: { type: String, default: null },
    parentId: { type: Schema.Types.ObjectId, ref: "Services", default: null },
    level: {
      type: Number,
      enum: [1, 2, 3],
      default: 1,
    },
    platformFee: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>("Category", CategorySchema);
export default Category;
