import { Document, Types } from "mongoose";
import { IUser } from "./user";

export type WorkerStatus = "pending" | "verified" | "rejected" | "needs_revision";

export type RateType = "hourly" | "fixed";
export type DocumentType = "id_proof" | "license" | "certificate" | "other";

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
  _id?: string;
  type: DocumentType;
  url: string;
  name?: string;
  status?: "pending" | "verified" | "rejected";
  rejectReason?: string;
}

export interface IWorker extends Document<string> {
  userId: Types.ObjectId | IUser;
  displayName: string;
  tagline: string;
  about: string;
  coverImage: string | null;
  status: WorkerStatus;
  experience: number;
  defaultRate: number;
  documents: IDocument[];
  skills: string[];
  cities: string[];
  availability: IAvailabilitySlots;
  createdAt: Date;
  rejectReason?: string;
}

export type DocumentDto = Omit<IDocument, "_id"> & { id?: string };
// completedJobs
