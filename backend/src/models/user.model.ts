import mongoose, { Schema } from "mongoose";
import { IAdress, ILocation, IUser } from "@/types/user";
import { ROLE } from "@/constants";

const LocationSchema = new Schema<ILocation>(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
    },
  },
  { _id: false }
);

const AddressSchema = new Schema<IAdress>(
  {
    house: { type: String },
    place: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
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
      address: {
        type: AddressSchema,
      },
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
