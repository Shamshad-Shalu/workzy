import { Document, Types } from "mongoose";

import { BookingPaymentStatus, BookingStatus, PricingMode, Role } from "@/constants";

import { ICategory } from "./category";
import { IService } from "./service";
import { ILocation, IUser } from "./user";
import { IWorker } from "./worker";

export type ExtraChargeStatus = "pending" | "approved" | "rejected";
export type ListingStatus = BookingStatus | "all" | "upcoming";

export interface IBookingLocation {
  label: string;
  location: ILocation;
}

export interface IExtraCharge {
  amount: number;
  reason: string;
  evidenceUrl?: string;
  status: ExtraChargeStatus;
  requestedAt: Date;
  respondedAt?: Date;
}

export interface IBookingStatusHistory {
  status: BookingStatus;
  changedAt: Date;
  changedBy?: Role;
  reason?: string;
}
export interface IEvidenceItem {
  url: string;
  type: "image" | "video";
}
export interface IEvidence {
  before: IEvidenceItem[];
  after: IEvidenceItem[];
  uploadedAt?: Date;
}

export interface IBooking extends Document<string> {
  bookingId: string;
  userId: Types.ObjectId;
  workerId: Types.ObjectId;
  serviceId: Types.ObjectId;
  categoryId: Types.ObjectId;
  // Schedule
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  address: IBookingLocation | null;

  rate: number; // worker rate per unit
  itemCount: number;
  subtotal: number; // rate * itemCount
  discountPercent: number; // 0 if no discount
  discountAmount: number; // subtotal * discountPercent/100
  chargeableAmount: number; // subtotal - discountAmount  ← platform fee based on THIS
  travelCost: number; // no platform fee on this
  platformFeePercent: number; // snapshot from category at booking time
  platformFee: number; // chargeableAmount * platformFeePercent/100
  total: number; // chargeableAmount + travelCost (user pays this)

  extraCharge?: IExtraCharge;
  evidence?: IEvidence;
  paymentStatus: BookingPaymentStatus;
  status: BookingStatus;
  statusHistory: IBookingStatusHistory[];
  isReviewed: boolean;
  userNote?: string;
  adminNote?: string;
  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface BookingContext {
  worker: IWorker;
  user: IUser;
  service: IService;
  category: ICategory;
  isRemote: boolean;
  pricingMode: PricingMode;
  rate: number;
  estimatedDuration: number;
  bufferTime: number;
  platformFeePercent: number;
  travelRatePerKM: number;
  distanceKm: number;
  travelCost: number;
  workerStripeId: string;
}

export interface BookingCursor {
  date: string;
  startTime: string;
  _id: string;
}
export interface BookingListParams {
  status: ListingStatus;
  limit: number;
  cursor: BookingCursor | null;
  sort: "asc" | "desc";
}

export interface BookingCardEntity {
  _id: string;
  bookingId: string;
  user: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  worker: {
    _id: string;
    displayName: string;
    tagline: string;
    coverImage?: string;
    profileImage?: string;
    isPremium: boolean;
    averageRating: number;
  };
  category: {
    _id: string;
    name: string;
    iconUrl: string;
  };
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  address: IBookingLocation | null;
  total: number;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  extraCharge?: IExtraCharge;
  evidence?: IEvidence;
  isReviewed?: boolean;
  statusHistory: IBookingStatusHistory[];
  userNote?: string;
  createdAt?: Date;
}

export interface PaginatedBookingsEntity {
  data: BookingCardEntity[];
  cursor: string | null;
  hasMore: boolean;
  total?: number;
}

export type BookingDetailsEntity = Omit<
  IBooking,
  "userId" | "workerId" | "serviceId" | "categoryId"
> & {
  _id: Types.ObjectId;
  user: Pick<IUser, "_id" | "name" | "profileImage">;
  worker: Pick<
    IWorker,
    | "_id"
    | "displayName"
    | "tagline"
    | "coverImage"
    | "isPremium"
    | "averageRating"
    | "reviewCount"
    | "worksCompleted"
  > & {
    profileImage?: string;
  };
  category: Pick<ICategory, "_id" | "name" | "iconUrl" | "imageUrl">;
};
