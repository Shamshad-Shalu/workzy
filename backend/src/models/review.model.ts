import mongoose, { Schema } from "mongoose";

import { IReview } from "@/types/review";

import { EvidenceItemSchema } from "./booking.model";

const ReviewSchema = new Schema<IReview>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },

    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewText: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    media: { type: [EvidenceItemSchema] },
    reply: {
      message: { type: String, trim: true },
      repliedAt: { type: Date },
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ workerId: 1, isHidden: 1, createdAt: -1, _id: -1 });
ReviewSchema.index({ workerId: 1, isHidden: 1, rating: -1, _id: -1 });
ReviewSchema.index({ serviceId: 1, isHidden: 1, createdAt: -1, _id: -1 });
ReviewSchema.index({ userId: 1, createdAt: -1, _id: -1 });
ReviewSchema.index({ categoryId: 1, isHidden: 1, createdAt: -1, _id: -1 });
ReviewSchema.index({ reviewText: "text" });

const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
export default ReviewModel;
