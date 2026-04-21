import dayjs from "dayjs";
import { FilterQuery, Types } from "mongoose";

import { BOOKING_STATUS, BookingPaymentStatus, BookingStatus } from "@/constants";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import Booking from "@/models/booking.model";
import { BookingListItem, BookingListQuery, IBooking } from "@/types/booking";

export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
  constructor() {
    super(Booking);
  }
  async getBookings(
    input: BookingListQuery
  ): Promise<{ bookings: BookingListItem[]; nextCursor: string | null }> {
    const { status, search, paymentStatus, limit, userId, workerId, cursor, fromDate, toDate } =
      input;

    const query: FilterQuery<IBooking> = {};
    const andConditions: FilterQuery<IBooking>[] = [];

    if (userId) query.userId = new Types.ObjectId(userId);
    if (workerId) query.workerId = new Types.ObjectId(workerId);
    if (status === "upcoming") {
      query.status = {
        $in: [
          BOOKING_STATUS.PENDING,
          BOOKING_STATUS.CONFIRMED,
          BOOKING_STATUS.EN_ROUTE,
          BOOKING_STATUS.REACHED,
          BOOKING_STATUS.IN_PROGRESS,
        ] as BookingStatus[],
      };
    } else if (status && status !== "all") {
      query.status = status as BookingStatus;
    }
    if (paymentStatus !== "all") {
      query.paymentStatus = paymentStatus as BookingPaymentStatus;
    }
    if (search) {
      andConditions.push({
        $or: [
          { bookingId: { $regex: search, $options: "i" } },
          { "snapshot.user.name": { $regex: search, $options: "i" } },
          { "snapshot.worker.name": { $regex: search, $options: "i" } },
        ],
      });
    }
    if (fromDate || toDate) {
      const fromDateTime = fromDate ? dayjs(fromDate).startOf("day").toDate() : undefined;
      const toDateTime = toDate ? dayjs(toDate).endOf("day").toDate() : undefined;
      query["dates.0.date"] = {
        ...(fromDateTime && { $gte: new Date(fromDateTime) }),
        ...(toDateTime && { $lte: new Date(toDateTime) }),
      };
    }

    if (cursor) {
      andConditions.push({
        $or: [
          { createdAt: { $lt: new Date(cursor.createdAt) } },
          {
            createdAt: new Date(cursor.createdAt),
            _id: { $lt: new Types.ObjectId(cursor._id) },
          },
        ],
      });
    }
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }
    const docs = await this.model
      .find(query)
      .select(
        "bookingId dates duration snapshot address total completedAt itemCount status paymentStatus createdAt workerId userId serviceId categoryId hasVisibleReview reviewId completedAt userNote quoteId extraCharge"
      )
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean<BookingListItem[]>();

    let nextCursor: string | null = null;
    if (docs.length > limit) {
      docs.pop();
      const lastItem = docs[docs.length - 1];

      nextCursor = Buffer.from(
        JSON.stringify({
          createdAt: lastItem.createdAt.toISOString(),
          _id: lastItem._id.toString(),
        })
      ).toString("base64url");
    }
    return {
      bookings: docs,
      nextCursor: nextCursor,
    };
  }

  getExpiredBookings(): Promise<IBooking[]> {
    const cutoffDate = dayjs().subtract(1, "day").startOf("day").toDate();
    return this.model.find({
      status: BOOKING_STATUS.PENDING,
      dates: {
        $not: {
          $elemMatch: {
            date: { $gte: cutoffDate },
          },
        },
      },
    });
  }
}
