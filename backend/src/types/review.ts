import { Document, Types } from "mongoose";

import { IBookingSnapshot } from "./booking";

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

export type ReviewListQueryInput = {
  limit: number;
  cursor?: {
    createdAt: Date;
    _id: string;
    rating?: number;
  };
  search?: string;

  serviceId?: string;
  categoryId?: string;
  userId?: string;
  workerId?: string;

  rating?: number;
  minRating?: number;
  maxRating?: number;
  isHidden?: boolean;
  fromDate?: string;
  toDate?: string;
  sortBy?: "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
};

export interface ReviewListQuery extends Omit<ReviewListQueryInput, "fromDate" | "toDate"> {
  fromDate?: Date;
  toDate?: Date;
}

export interface IReviewPopulated extends Omit<IReview, "bookingId"> {
  bookingId: {
    _id: Types.ObjectId;
    snapshot: IBookingSnapshot;
  };
}
