import { Document, Types } from "mongoose";

import { DisputeReason, DisputeResolution, DisputeStatus, Role } from "@/constants";

import { IEvidenceItem } from "../booking/booking.entity";

export interface IDispute extends Document<string> {
  disputeId: string;
  bookingId: Types.ObjectId;
  userId: Types.ObjectId;
  workerId: Types.ObjectId;
  raisedBy: Role;

  status: DisputeStatus;
  reason: DisputeReason;
  resolution?: DisputeResolution;
  description: string;

  evidence: IEvidenceItem[];
  refundedAmount?: number;

  adminNote?: string;
  resolvedBy?: Types.ObjectId;
  searchText: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
