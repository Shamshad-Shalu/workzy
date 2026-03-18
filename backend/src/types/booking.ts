import { Document, Types } from "mongoose";

import { BookingPaymentStatus, BookingStatus, PricingMode, Role } from "@/constants";

import { ICategory } from "./category";
import { IService } from "./service";
import { ILocation, IUser } from "./user";
import { IWorker } from "./worker";

interface IBookingLocation {
  label: string;
  location: ILocation;
}

export interface IExtraCharge {
  amount: number;
  reason: string;
  evidenceUrl?: string; // receipt photo
  status: "pending" | "approved" | "rejected";
  requestedAt: Date;
  respondedAt?: Date;
}

interface IBookingStatusHistory {
  status: BookingStatus;
  changedAt: Date;
  changedBy?: Role;
  reason?: string; // rejection reason / cancel reason
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

  paymentStatus: BookingPaymentStatus;
  status: BookingStatus;
  statusHistory: IBookingStatusHistory[];
  extraCharge?: IExtraCharge;

  userNote?: string;
  cancelledBy?: Role;
  cancelReason?: string;
  cancelledAt?: Date;

  rejectionReason?: string;
  rejectedAt?: Date;
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
