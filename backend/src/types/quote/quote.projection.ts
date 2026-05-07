import { Types } from "mongoose";

import { QuoteStatus } from "@/constants";

import { IBookingSlot } from "../booking/booking.entity";

export type QuoteListItem = {
  _id: Types.ObjectId;
  bookingId: Types.ObjectId;
  dates: IBookingSlot[];
  totalPrice: number;
  message?: string;
  status: QuoteStatus;
  createdAt: Date;
  workerId: {
    _id: Types.ObjectId;
    displayName: string;
    profileImage: string;
  };
  userId: {
    _id: Types.ObjectId;
    name: string;
    profileImage: string;
  };
  categoryId: {
    _id: Types.ObjectId;
    name: string;
    iconUrl: string;
  };
};
