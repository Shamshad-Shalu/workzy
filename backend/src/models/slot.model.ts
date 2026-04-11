import mongoose, { Schema } from "mongoose";

import { SLOT_STATUS, SLOT_STATUS_VALUES } from "@/constants/booking";
import { ISlot } from "@/types/slot";

import { LocationSchema } from "./user.model";

const SlotSchema: Schema<ISlot> = new Schema(
  {
    workerId: { type: Schema.Types.ObjectId, ref: "Worker", required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true }, // "10:30"
    isFullDay: { type: Boolean, default: false },
    duration: { type: Number, required: true },
    status: {
      type: String,
      enum: SLOT_STATUS_VALUES,
      default: SLOT_STATUS.RESERVED,
    },
    location: LocationSchema,
    travelFromPrev: { type: Number, default: 0 },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", default: null },
    quoteId: { type: Schema.Types.ObjectId, ref: "Quote", default: null },
    reservedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reservedUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

SlotSchema.index({ workerId: 1, date: 1, status: 1 });
SlotSchema.index({ status: 1, reservedUntil: 1 });
SlotSchema.index(
  { workerId: 1, date: 1, startTime: 1 },
  { unique: true, partialFilterExpression: { isFullDay: false } }
);
SlotSchema.index(
  { workerId: 1, date: 1, isFullDay: 1 },
  { unique: true, partialFilterExpression: { isFullDay: true } }
);

const SlotModel = mongoose.model<ISlot>("Slot", SlotSchema);
export default SlotModel;
