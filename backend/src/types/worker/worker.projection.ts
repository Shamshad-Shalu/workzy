import { Types } from "mongoose";

import { PricingMode, ServiceType, StripeAccountStatus, WorkerStatus } from "@/constants";

import { BulkDiscountType } from "../service";

import { IGeoLocation, IJobStats, IReviewStats } from "./worker.entity";

export type WorkerListItem = {
  _id: string;
  userId: {
    _id: Types.ObjectId;
    email: string;
  };
  displayName: string;
  phone?: string;
  profileImage?: string;
  stripeAccountStatus: StripeAccountStatus;
  status: WorkerStatus;
  createdAt: Date;
};

export type NearbyWorkerItem = {
  _id: string;
  profileImage?: string;
  displayName: string;
  tagline: string;
  experience: number;
  distance: number;
  completedJobs: number;
  averageRating: number;
};

export type WorkerProfile = {
  _id: string;
  displayName: string;
  tagline: string;
  about: string;
  profileImage?: string;
  coverImage?: string;
  location: IGeoLocation;
  experience: number;

  jobStats: IJobStats;
  reviewStats: IReviewStats;
};

export type PublicWorkerListItem = {
  _id: string;
  displayName: string;
  tagline: string;
  profileImage?: string;
  experience: number;

  serviceId: string;
  serviceRate: number;
  description: string;
  estimatedDuration: number;
  bufferTime: number;
  categoryName: string;
  serviceType: ServiceType;
  PricingMode: PricingMode;
  bulkDiscounts: BulkDiscountType[] | null;

  averageRating: number;
  reviewCount: number;
  isAvailable: boolean;
  travelCost: number;
  distanceKm: number;
};
