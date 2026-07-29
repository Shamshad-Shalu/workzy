import { Document, Types } from "mongoose";

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
