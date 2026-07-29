import { Types } from "mongoose";

import { IBookingSnapshot } from "../booking/booking.entity";

import { IReview } from "./review.entity";

export interface ReviewListItem extends Omit<IReview, "bookingId" | "userId" | "workerId"> {
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
