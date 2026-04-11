import { Document, Types } from "mongoose";

import { PricingMode, ServiceType, StripeAccountStatus } from "@/constants";

import { BulkDiscountType } from "./service";
import { ILocation, IUser } from "./user";

export type WorkerStatus = "pending" | "verified" | "rejected" | "needs_revision";

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
  userId: Types.ObjectId;
  displayName: string;
  tagline: string;
  about: string;
  coverImage: string | null;
  status: WorkerStatus;
  isPremium: boolean;
  experience: number;
  defaultRate: number;
  documents: IDocument[];
  skills: string[];
  cities: string[];
  availability: IAvailabilitySlots;
  rejectReason?: string;
  averageRating: number;
  reviewCount: number;
  completionRate: number | null;
  worksCompleted: number;
  location: ILocation;
  stripeAccountId?: string;
  stripeAccountStatus: StripeAccountStatus;
  createdAt: Date;
}

export type Day = keyof IAvailabilitySlots;
export type DocumentDto = Omit<IDocument, "_id"> & { id?: string };
// completedJobs

export type WorkerSummaryEntity = Pick<
  IWorker,
  | "_id"
  | "displayName"
  | "tagline"
  | "coverImage"
  | "about"
  | "experience"
  | "worksCompleted"
  | "reviewCount"
  | "defaultRate"
  | "averageRating"
  | "completionRate"
  | "cities"
  | "skills"
  | "isPremium"
  | "createdAt"
> &
  Pick<IUser, "profileImage" | "profile">;

export type NearbyWorkerEntity = {
  _id: IUser["_id"];
  profileImage: IUser["profileImage"];
  workerId: IWorker["_id"];
  displayName: IWorker["displayName"];
  tagline: IWorker["tagline"];
  experience: IWorker["experience"];
  distance: number;
};

export interface WorkerListingFilters {
  lat: number;
  lng: number;
  radiusKm: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availableNow?: boolean;
  page: number;
  limit: number;
}
export interface WorkerListingEntity {
  serviceId: string;
  workerId: string;
  userId: string;
  displayName: string;
  tagline: string;
  description: string;
  coverImage: string | null;
  profileImage: string | null;
  experience: number;
  serviceRate: number;
  bulkDiscounts: BulkDiscountType[] | null;
  estimatedDuration: number | null;
  pricingMode: PricingMode;
  serviceType: ServiceType;
  averageRating: number;
  worksCompleted: number;
  reviewCount: number;
  categoryName: string;
  isPremium: boolean;
  travelCost: number | null;
  distanceKm?: number | null;
  totalAmount: number;
}
