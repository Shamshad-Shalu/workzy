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
  uploadedAt: Date;
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

export interface UserBookingEntity {
  _id: string;
  bookingId: string;
  userId: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  workerId: {
    _id: string;
    displayName: string;
    tagline: string;
    coverImage?: string;
    averageRating: number;
  };
  categoryId: {
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

  ccreatedAt?: Date;
}

export interface PaginatedBookingsEntity {
  data: UserBookingEntity[];
  cursor: string | null;
  hasMore: boolean;
  total?: number;
}
