import { model, Schema } from "mongoose";

import {
  BOOKING_PAYMENT_STATUS,
  BOOKING_PAYMENT_STATUS_VALUES,
  BOOKING_STATUS,
  BOOKING_STATUS_VALUES,
  ROLE_VALUES,
} from "@/constants";
import { IBooking } from "@/types/booking";

import { LocationSchema } from "./user.model";

const ExtraChargeSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    evidenceUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      default: "pending",
    },
    requestedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    respondedAt: {
      type: Date,
    },
  },
  { _id: false }
);

const BookingStatusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: BOOKING_STATUS_VALUES,
      required: true,
    },
    changedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    changedBy: {
      type: String,
      enum: ROLE_VALUES,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { _id: false }
);

const BookingLocationSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    location: LocationSchema,
  },
  { _id: false }
);

const BookingSchema: Schema<IBooking> = new Schema(
  {
    bookingId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
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
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
      match: /^\d{2}:\d{2}$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^\d{2}:\d{2}$/,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    address: {
      type: BookingLocationSchema,
      default: null,
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
    itemCount: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercent: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    discountAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    chargeableAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    travelCost: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    platformFeePercent: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    platformFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    total: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: BOOKING_PAYMENT_STATUS_VALUES,
      required: true,
      default: BOOKING_PAYMENT_STATUS.PENDING,
      index: true,
    },
    status: {
      type: String,
      enum: BOOKING_STATUS_VALUES,
      required: true,
      default: BOOKING_STATUS.PENDING,
    },
    extraCharge: { type: ExtraChargeSchema },
    statusHistory: {
      type: [BookingStatusHistorySchema],
      default: [],
    },
    userNote: {
      type: String,
      trim: true,
    },
    cancelledBy: { type: String, enum: ROLE_VALUES },
    cancelReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    cancelledAt: { type: Date },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    rejectedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

BookingSchema.index({ userId: 1, createdAt: -1 }); // user booking list: my bookings
BookingSchema.index({ workerId: 1, createdAt: -1 }); // worker dashboard / jobs
BookingSchema.index({ workerId: 1, status: 1, date: 1, startTime: 1 }); // worker upcoming jobs

const Booking = model<IBooking>("Booking", BookingSchema);
export default Booking;
