import mongoose, { Schema } from "mongoose";

import { STRIPE_ACCOUNT_STATUS, WORKER_STATUS } from "@/constants";
import { IAvailabilitySlots, IDocument, IWorker } from "@/types/worker";

import { LocationSchema } from "./user.model";

const AvailabilitySchema = new Schema<IAvailabilitySlots>(
  {
    monday: [{ startTime: String, endTime: String }],
    tuesday: [{ startTime: String, endTime: String }],
    wednesday: [{ startTime: String, endTime: String }],
    thursday: [{ startTime: String, endTime: String }],
    friday: [{ startTime: String, endTime: String }],
    saturday: [{ startTime: String, endTime: String }],
    sunday: [{ startTime: String, endTime: String }],
  },
  { _id: false }
);

const DocumentSchema = new Schema<IDocument>({
  name: { type: String },
  type: { type: String, enum: ["id_proof", "license", "certificate", "other"], required: true },
  url: { type: String, required: true },
  status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  rejectReason: { type: String },
});

const workerSchema: Schema = new Schema<IWorker>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    tagline: { type: String },
    about: { type: String },
    status: {
      type: String,
      enum: Object.values(WORKER_STATUS),
      default: WORKER_STATUS.PENDING,
    },
    coverImage: {
      type: String,
      default: null,
    },
    defaultRate: {
      type: Number,
    },
    experience: {
      type: Number,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    cities: {
      type: [String],
      default: [],
    },
    availability: {
      type: AvailabilitySchema,
      default: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
    },
    documents: {
      type: [DocumentSchema],
      default: [],
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    jobsOffered: {
      type: Number,
      default: 0,
    },
    noResponses: {
      type: Number,
      default: 0,
    },
    jobsAccepted: {
      type: Number,
      default: 0,
    },
    jobsCompleted: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    ratingBreakdown: {
      "1": { type: Number, default: 0 },
      "2": { type: Number, default: 0 },
      "3": { type: Number, default: 0 },
      "4": { type: Number, default: 0 },
      "5": { type: Number, default: 0 },
    },

    rejectReason: { type: String },
    location: {
      type: LocationSchema,
      required: true,
    },
    stripeAccountId: { type: String },
    stripeAccountStatus: {
      type: String,
      enum: Object.values(STRIPE_ACCOUNT_STATUS),
      default: STRIPE_ACCOUNT_STATUS.NOT_CONNECTED,
    },
  },
  { timestamps: true }
);

workerSchema.index({ displayName: "text" });
workerSchema.index({ location: "2dsphere" });

const Worker = mongoose.model<IWorker>("Worker", workerSchema);
export default Worker;
