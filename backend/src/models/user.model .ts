import mongoose, { Schema } from "mongoose";
import { ILocation, IUser } from "@/types/user";
import { ROLE } from "@/constants";

const LocationSchema = new Schema<ILocation>(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      required: true,
      default: ROLE.USER,
    },
    phone: { type: Number },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    profile: {
      bio: { type: String },
      address: { type: String },
      location: {
        type: LocationSchema,
      },
    },
  },
  { timestamps: true }
);

userSchema.index({ "profile.location": "2dsphere" });
userSchema.index({ name: "text", email: "text" });

const User = mongoose.model<IUser>("User", userSchema);
export default User;
