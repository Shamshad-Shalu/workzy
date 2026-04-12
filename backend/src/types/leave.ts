import { FlattenMaps, Types } from "mongoose";
import { Document } from "mongoose";

export type LeaveFilter = "all" | "upcoming" | "past" | "this-month";

export interface ILeave extends Document<string> {
  workerId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  reason?: string;
  createdAt: Date;
}
export type LeaveLean = FlattenMaps<ILeave>;

export interface LeaveStatsResponseDTO {
  total: number;
  upcoming: number;
  past: number;
  thisMonth: number;
}
export interface GetLeavesQueryDTO {
  workerId: string;
  filter: LeaveFilter;
  cursor: string | null;
  limit: number;
}
