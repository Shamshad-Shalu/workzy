import { Document, Types } from "mongoose";

import { SlotStatus } from "@/constants/booking";

import { ILocation } from "./user";

export interface ISlot extends Document<string> {
  workerId: Types.ObjectId;
  serviceId: Types.ObjectId;
  date: Date;
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  status: SlotStatus;
  location: ILocation | null; // null for remote
  travelFromPrev: number; // minutes (0 if first job)
  serviceDuration: number; // minutes (without buffer)
  bufferTime: number;
  itemCount: number; // minutes
  bookingId?: Types.ObjectId;
  reservedBy?: Types.ObjectId;
  reservedUntil?: Date;
  createdAt?: Date;
}

export interface GetSlotsDTO {
  workerId: string;
  serviceId: string;
  date: Date;
  lat?: number;
  lng?: number;
  itemCount?: number;
}

export type GetAvailableDatesDTO = Omit<GetSlotsDTO, "date">;

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  travelFromPrev: number;
}
