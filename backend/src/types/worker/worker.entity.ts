import { Document, Types } from "mongoose";

import { StripeAccountStatus, WorkerStatus } from "@/constants";

export type DocumentType = "id_proof" | "license" | "certificate" | "other";

export interface ITimeSlot {
  startTime: string;
  endTime: string;
}
export interface IGeoLocation {
  type: "Point";
  coordinates: [number, number];
  addressLabel: string;
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
  status?: "pending" | "in_review" | "verified" | "rejected";
  rejectReason?: string;
  verifiedAt?: Date;
}
export interface IReviewStats {
  averageRating: number;
  totalRating: number;
  reviewCount: number;
  breakdown: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
}
export interface IJobStats {
  offered: number;
  accepted: number;
  completed: number;
  noResponse: number;
}

export interface IWorker extends Document<string> {
  userId: Types.ObjectId;
  displayName: string;
  tagline: string;
  about: string;
  phone: string;
  profileImage?: string;
  coverImage?: string;

  status: WorkerStatus;
  experience: number;
  documents: IDocument[];

  availability: IAvailabilitySlots;
  rejectReason?: string;
  suspensionReason?: string;

  location: IGeoLocation;
  currentLocation?: {
    type: "Point";
    coordinates: [number, number];
    lastUpdated: Date;
  };
  jobStats: IJobStats;
  reviewStats: IReviewStats;
  stripeAccountId?: string;
  stripeAccountStatus: StripeAccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type Day = keyof IAvailabilitySlots;
export type DocumentDto = Omit<IDocument, "_id"> & { id?: string };
