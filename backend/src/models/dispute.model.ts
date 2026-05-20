import { model, Schema } from "mongoose";

import {
  DISPUTE_REASON_VALUES,
  DISPUTE_RESOLUTION,
  DISPUTE_STATUS,
  DISPUTE_STATUS_VALUES,
  ROLE_VALUES,
} from "@/constants";
import { IDispute } from "@/types/dispute/dispute.entity";

import { EvidenceItemSchema } from "./booking.model";

const DisputeSchema = new Schema<IDispute>(
  {
    disputeId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
      index: true,
    },
    raisedBy: {
      type: String,
      enum: ROLE_VALUES,
      required: true,
    },
    reason: {
      type: String,
      enum: DISPUTE_REASON_VALUES,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: DISPUTE_STATUS_VALUES,
      default: DISPUTE_STATUS.PENDING,
      index: true,
    },
    resolution: {
      type: String,
      enum: Object.values(DISPUTE_RESOLUTION),
    },
    evidence: {
      type: [EvidenceItemSchema],
      default: [],
    },
    refundedAmount: {
      type: Number,
    },
    searchText: {
      type: String,
      index: "text",
    },
    adminNote: {
      type: String,
      trim: true,
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Dispute = model<IDispute>("Dispute", DisputeSchema);
export default Dispute;
