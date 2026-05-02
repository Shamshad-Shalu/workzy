import { Document, Types } from "mongoose";

import { SlotStatus } from "@/constants/booking";

import { ILocation } from "./user/user.entity";

export interface ISlot extends Document<string> {
  workerId: Types.ObjectId;
  serviceId: Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  isFullDay: boolean;
  duration: number; // total = serviceDuration + bufferTime
  status: SlotStatus;
  location: ILocation;
  travelFromPrev: number;
  bookingId?: Types.ObjectId;
  quoteId?: Types.ObjectId;
  reservedBy?: Types.ObjectId;
  reservedUntil?: Date;
  createdAt?: Date;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface GetSlotsDTO {
  workerId: string;
  serviceId: string;
  date: Date;
  lat: number;
  lng: number;
  itemCount?: number;
}
export type GetQuoteAvailableDatesDTO = {
  workerId: string;
  serviceId: string;
  itemCount?: number;
  startDate?: string;
  endDate?: string;
};

export type GetAvailableDatesDTO = GetQuoteAvailableDatesDTO & {
  lat: number;
  lng: number;
};

export interface AvailableSlot {
  startTime: string;
  endTime: string;
  travelFromPrev: number;
}
