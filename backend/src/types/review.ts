import { Document, Types } from "mongoose";

import { IBookingSnapshot } from "./booking/booking.entity";

export interface IReview extends Document<string> {
  bookingId: Types.ObjectId;
  userId: Types.ObjectId;
  workerId: Types.ObjectId;
  serviceId: Types.ObjectId;
  categoryId: Types.ObjectId;

  rating: number;
  reviewText?: string;
  media?: {
    url: string;
    type: "image" | "video";
  }[];

  reply?: {
    message: string;
    repliedAt: Date;
  };

  isEdited: boolean;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkerReviewStats {
  averageRating: number;
  reviewCount: number;
  ratingBreakdown: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
}

export interface ReviewListQueryInput {
  limit: number;
  cursor?: {
    createdAt: Date;
    _id: string;
    rating?: number;
  };
  rating?: number;
  sortBy?: "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
}
export interface AdminReviewListQueryInput extends ReviewListQueryInput {
  search?: string;
  serviceId?: string;
  categoryId?: string;
  userId?: string;
  workerId?: string;
  minRating?: number;
  maxRating?: number;
  status: "all" | "hidden" | "visible";
  fromDate?: string;
  toDate?: string;
}

export interface ReviewListQuery extends Omit<AdminReviewListQueryInput, "fromDate" | "toDate"> {
  fromDate?: Date;
  toDate?: Date;
}

export interface IReviewPopulated extends Omit<IReview, "bookingId" | "userId" | "workerId"> {
  bookingId: {
    _id: Types.ObjectId;
    snapshot: IBookingSnapshot;
  };
  userId: {
    _id: Types.ObjectId;
    profileImage?: string;
  };
  workerId: {
    _id: Types.ObjectId;
    profileImage?: string;
  };
}
