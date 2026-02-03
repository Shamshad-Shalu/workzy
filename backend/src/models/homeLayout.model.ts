import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

interface IHomeLayoutItem {
  sectionId: Types.ObjectId;
  order: number;
  isActive: boolean;
}

type HomeLayoutFields = {
  key: "HOME";
  items: IHomeLayoutItem[];
};

export type IHomeLayout = HydratedDocument<HomeLayoutFields>;

const HomeLayoutItemSchema = new Schema<IHomeLayoutItem>(
  {
    sectionId: { type: Schema.Types.ObjectId, ref: "HomeSection", required: true },
    order: { type: Number, required: true, min: 1 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const HomeLayoutSchema = new Schema<IHomeLayout>(
  {
    key: { type: String, required: true, unique: true, default: "HOME" },
    items: { type: [HomeLayoutItemSchema], default: [] },
  },
  { timestamps: true }
);

const HomeLayout = mongoose.model<IHomeLayout>("HomeLayout", HomeLayoutSchema, "home_layouts");
export default HomeLayout;
