import mongoose, { HydratedDocument, Schema } from "mongoose";

import { HOME_SECTION_TYPE, HomeSectionType } from "@/constants/home";
import { HomeSectionData } from "@/types/home";

type HomeSectionFields = {
  name: string;
  type: HomeSectionType;
  data: HomeSectionData;
  isActive: boolean;
};

export type IHomeSection = HydratedDocument<HomeSectionFields> & {
  createdAt: Date;
  updatedAt: Date;
};

const HomeSectionSchema = new Schema<IHomeSection>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(HOME_SECTION_TYPE) as HomeSectionType[],
    },
    data: { type: Schema.Types.Mixed, required: true, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const HomeSection = mongoose.model<IHomeSection>("HomeSection", HomeSectionSchema, "home_sections");
export default HomeSection;
