import mongoose, { Schema } from "mongoose";

import { ILeave } from "@/types/leave";

const LeaveSchema: Schema<ILeave> = new Schema(
  {
    workerId: { type: Schema.Types.ObjectId, ref: "Worker", required: true, index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, default: null },
  },
  { timestamps: true }
);

LeaveSchema.index({ workerId: 1, startDate: 1, endDate: 1 });

const LeaveModel = mongoose.model<ILeave>("Leave", LeaveSchema);
export default LeaveModel;
