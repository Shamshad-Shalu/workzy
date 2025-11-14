import { Document, ObjectId } from "mongoose";
import { IUser } from "./user";

export type RateType = "hourly" | "fixed";

export interface IRate {
  amount: number;
  type: RateType;
}

export interface ITimeSlot {
  startTime: string;
  endTime: string;
}

export interface IAvailabilitySlots {
  monday: ITimeSlot[];
  tuesday: ITimeSlot[];
  wednesday: ITimeSlot[];
  thursday: ITimeSlot[];
  friday: ITimeSlot[];
  saturday: ITimeSlot[];
  sunday: ITimeSlot[];
}

export interface IWorker extends Document<string> {
  userId: ObjectId | IUser;
  displayName: string;
  displayImage: string;
  rate: IRate;
  isVerified: boolean;
  documents: string[];
  skills: string[];
  availability: IAvailabilitySlots;
}
