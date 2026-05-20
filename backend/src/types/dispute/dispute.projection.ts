import { Types } from "mongoose";

import { IBookingSnapshot } from "../booking/booking.entity";

import { IDispute } from "./dispute.entity";

export type DisputeListItem = Omit<
  Pick<
    IDispute,
    | "_id"
    | "disputeId"
    | "workerId"
    | "userId"
    | "bookingId"
    | "raisedBy"
    | "status"
    | "reason"
    | "createdAt"
  >,
  "workerId" | "userId"
> & {
  workerId: {
    _id: Types.ObjectId;
    displayName: string;
    profileImage?: string;
  };
  userId: {
    _id: Types.ObjectId;
    name: string;
    profileImage?: string;
  };
};

export type DisputeDetails = Omit<
  Pick<
    IDispute,
    | "_id"
    | "disputeId"
    | "status"
    | "raisedBy"
    | "reason"
    | "resolution"
    | "description"
    | "evidence"
    | "refundedAmount"
    | "adminNote"
    | "resolvedAt"
    | "createdAt"
    | "workerId"
    | "bookingId"
    | "userId"
  >,
  "workerId" | "userId" | "bookingId"
> & {
  workerId: {
    _id: Types.ObjectId;
    displayName: string;
    phone: string;
    profileImage?: string;
  };
  userId: {
    _id: Types.ObjectId;
    name: string;
    phone: string;
    profileImage?: string;
  };
  bookingId: {
    _id: Types.ObjectId;
    snapshot: IBookingSnapshot;
  };
};
