import { Document, ObjectId } from "mongoose";
import { IUser } from "./user";

export type WorkerStatus = "pending" | "verified" | "rejected" | "needs_revision";
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

export interface IDocument {
  type: "id_proof" | "license" | "certificate" | "other";
  url: string;
  name?: string;
  status: "pending" | "verified" | "rejected";
  rejectReason?: string;
}

export interface IWorker extends Document<string> {
  userId: ObjectId | IUser;
  displayName: string;
  tagline?: string;
  about?: string;
  coverImage?: string;
  status: WorkerStatus;
  experience: number;
  defaultRate: IRate;
  documents: IDocument[];
  skills: string[];
  cities: string[];
  availability: IAvailabilitySlots;
  createdAt: Date;
}
