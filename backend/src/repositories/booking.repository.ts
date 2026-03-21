import { FilterQuery, Types } from "mongoose";

import { BOOKING_STATUS, BookingStatus } from "@/constants";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import Booking from "@/models/booking.model";
import {
  BookingListParams,
  IBooking,
  PaginatedBookingsEntity,
  UserBookingEntity,
} from "@/types/booking";

const BOOKING_POPULATE = [
  { path: "workerId", select: "displayName tagline averageRating coverImage" },
  { path: "userId", select: "name profileImage phone" },
  { path: "categoryId", select: "name iconUrl" },
];

export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
  constructor() {
    super(Booking);
  }

  getUserBookings(userId: string, query: BookingListParams): Promise<PaginatedBookingsEntity> {
    return this.paginatedQuery("userId", userId, query);
  }

  private buildStatusFilter(
    ownerField: "userId" | "workerId",
    ownerId: string,
    status: string
  ): FilterQuery<IBooking> {
    const base: FilterQuery<IBooking> = {
      [ownerField]: new Types.ObjectId(ownerId),
    };
    if (status === "all" || !status) return base;
    if (status === "upcoming") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      return {
        ...base,
        status: { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING] as BookingStatus[] },
        date: { $gte: todayStart },
      };
    }
    return { ...base, status: status as BookingStatus };
  }
  private buildCursorFilter(
    cursor: BookingListParams["cursor"],
    op: "$lt" | "$gt"
  ): FilterQuery<IBooking> {
    if (!cursor) return {};

    const cursorDate = new Date(cursor.date);
    const cursorId = new Types.ObjectId(cursor._id);

    return {
      $or: [
        { date: { [op]: cursorDate } },
        { date: cursorDate, startTime: { [op]: cursor.startTime } },
        { date: cursorDate, startTime: cursor.startTime, _id: { [op]: cursorId } },
      ],
    };
  }

  private async paginatedQuery(
    ownerField: "userId" | "workerId",
    ownerId: string,
    query: BookingListParams
  ): Promise<PaginatedBookingsEntity> {
    const { status, cursor, limit, sort } = query;

    const dir: 1 | -1 = sort === "asc" ? 1 : -1;
    const op: "$lt" | "$gt" = sort === "asc" ? "$gt" : "$lt";

    const statusFilter = this.buildStatusFilter(ownerField, ownerId, status);
    const cursorFilter = this.buildCursorFilter(cursor, op);

    const finalFilter: FilterQuery<IBooking> = {
      ...statusFilter,
      ...(cursor ? cursorFilter : {}),
    };

    const docs = await Booking.find(finalFilter)
      .sort({ date: dir, startTime: dir, _id: dir })
      .limit(limit + 1)
      .populate(BOOKING_POPULATE)
      .lean<UserBookingEntity[]>();

    const hasMore = docs.length > limit;
    if (hasMore) docs.pop();

    let nextCursor: string | null = null;
    if (hasMore && docs.length > 0) {
      const last = docs[docs.length - 1];
      const cursorPayload = {
        date: (last.date as Date).toISOString(),
        startTime: last.startTime,
        _id: last._id.toString(),
      };
      nextCursor = Buffer.from(JSON.stringify(cursorPayload)).toString("base64url");
    }
    let total: number | undefined;
    if (!cursor) {
      total = await Booking.countDocuments(statusFilter);
    }
    return { data: docs, cursor: nextCursor, hasMore, total };
  }
}
