import mongoose, { Schema } from "mongoose";

import { QUOTE_STATUS, QUOTE_STATUS_VALUES } from "@/constants";
import { IQuote } from "@/types/quote/quote.entity";

const BookingSlotSchema = new Schema(
  {
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const QuoteSchema: Schema<IQuote> = new Schema(
  {
    workerId: { type: Schema.Types.ObjectId, ref: "Worker", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    slotIds: [{ type: Schema.Types.ObjectId, ref: "Slot" }],
    dates: { type: [BookingSlotSchema], required: true },
    totalPrice: { type: Number, required: true },
    message: { type: String, default: null },
    status: {
      type: String,
      enum: QUOTE_STATUS_VALUES,
      default: QUOTE_STATUS.PENDING,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

QuoteSchema.index({ userId: 1, status: 1 });
QuoteSchema.index({ workerId: 1, status: 1 });
QuoteSchema.index({ status: 1, expiresAt: 1 });

const QuoteModel = mongoose.model<IQuote>("Quote", QuoteSchema);
export default QuoteModel;
