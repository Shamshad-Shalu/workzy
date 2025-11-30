import { IAvailabilitySlots, IWorker } from "@/types/worker";
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
    displayImage: {
      type: String,
      default: "",
    },
    rate: {
      amount: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        enum: ["hourly", "fixed"],
        default: "fixed",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    skills: {
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
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

workerSchema.index({ displayName: "text" });

const Worker = mongoose.model<IWorker>("Worker", workerSchema);
export default Worker;
