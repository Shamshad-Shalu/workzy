import { IAvailabilitySlots, IDocument, IWorker } from "@/types/worker";
import mongoose, { Schema } from "mongoose";

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
      default: "pending",
    },
    coverImage: {
      type: String,
    },
    defaultRate: {
      amount: {
        type: Number,
      },
      type: {
        type: String,
        enum: ["hourly", "fixed"],
        default: "fixed",
      },
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
    rejectReason: { type: String },
  },
  { timestamps: true }
);

workerSchema.index({ displayName: "text" });

const Worker = mongoose.model<IWorker>("Worker", workerSchema);
export default Worker;
