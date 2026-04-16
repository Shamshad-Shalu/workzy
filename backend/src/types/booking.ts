import { Document, Types } from "mongoose";

import { BookingPaymentStatus, BookingStatus, PricingMode, Role } from "@/constants";

import { ICategory } from "./category";
import { IService } from "./service";
import { ILocation } from "./user";

export type ExtraChargeStatus = "pending" | "approved" | "rejected";
export type ListingStatus = BookingStatus | "all" | "upcoming";

export interface IBookingLocation {
  label: string;
  location: ILocation;
}
export interface IBookingSlot {
  date: Date;
  startTime: string;
  endTime: string;
}

export interface IBookingSnapshot {
  user: {
    name: string;
    phone?: string;
    profileImage?: string;
  };
  worker: {
    name: string;
    phone?: string;
    profileImage?: string;
    rating: number;
  };
  category: {
    name: string;
    iconUrl: string;
  };
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
  quoteId?: Types.ObjectId;

  // Schedule
  dates: IBookingSlot[];
  duration: number; //0 for full day
  address: IBookingLocation;

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

  otp?: string;
  chatId?: string;

  snapshot: IBookingSnapshot;

  paymentStatus: BookingPaymentStatus;
  status: BookingStatus;
  statusHistory: IBookingStatusHistory[];

  isReviewed: boolean;
  userNote?: string;
  workerNote?: string;
  adminNote?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingListItem = Pick<
  IBooking,
  | "_id"
  | "bookingId"
  | "dates"
  | "duration"
  | "itemCount"
  | "userNote"
  | "isReviewed"
  | "snapshot"
  | "address"
  | "total"
  | "status"
  | "paymentStatus"
  | "createdAt"
  | "workerId"
  | "categoryId"
  | "serviceId"
  | "userId"
  | "quoteId"
  | "extraCharge"
>;

export interface BookingContext {
  worker: {
    name: string;
    phone?: string;
    profileImage?: string;
    rating: number;
  };
  service: IService;
  category: ICategory;
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

export interface Cursor {
  createdAt: string;
  _id: string;
}

export interface BookingListQuery {
  status: ListingStatus;
  paymentStatus: BookingPaymentStatus | "all";
  userId?: string;
  workerId?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  limit: number;
  cursor?: Cursor | null;
}

export type BookingDetails = Omit<IBooking, "otp">;
