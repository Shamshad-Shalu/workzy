import { FilterQuery, PipelineStage, Types } from "mongoose";

import { BOOKING_STATUS, BookingPaymentStatus, BookingStatus } from "@/constants";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { IBookingRepository } from "@/core/interfaces/repositories/IBookingRepository";
import Booking from "@/models/booking.model";
import {
  AdminBookingListParams,
  BookingCardEntity,
  BookingCursor,
  BookingDetailsEntity,
  BookingListParams,
  IBooking,
  PaginatedBookingsEntity,
} from "@/types/booking";

export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
  constructor() {
    super(Booking);
  }

  async getBookingDetailById(bookingId: string): Promise<BookingDetailsEntity | null> {
    if (!Types.ObjectId.isValid(bookingId)) {
      return null;
    }
    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: new Types.ObjectId(bookingId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "bookingUser",
        },
      },
      { $unwind: { path: "$bookingUser", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "workers",
          localField: "workerId",
          foreignField: "_id",
          as: "worker",
        },
      },
      { $unwind: { path: "$worker", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "worker.userId",
          foreignField: "_id",
          as: "workerUser",
        },
      },
      { $unwind: { path: "$workerUser", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          bookingId: 1,
          date: 1,
          startTime: 1,
          endTime: 1,
          duration: 1,
          address: 1,

          rate: 1,
          itemCount: 1,
          subtotal: 1,
          discountPercent: 1,
          discountAmount: 1,
          chargeableAmount: 1,
          travelCost: 1,
          platformFeePercent: 1,
          platformFee: 1,
          total: 1,

          extraCharge: 1,
          evidence: 1,
          paymentStatus: 1,
          status: 1,
          statusHistory: 1,
          isReviewed: 1,
          userNote: 1,
          completedAt: 1,
          user: {
            _id: "$bookingUser._id",
            name: "$bookingUser.name",
            profileImage: "$bookingUser.profileImage",
          },
          worker: {
            _id: "$worker._id",
            displayName: "$worker.displayName",
            tagline: "$worker.tagline",
            coverImage: "$worker.coverImage",
            averageRating: "$worker.averageRating",
            isPremium: "$worker.isPremium",
            reviewCount: "$worker.reviewCount",
            worksCompleted: "$worker.worksCompleted",
            profileImage: "$workerUser.profileImage",
          },
          category: {
            _id: "$category._id",
            name: "$category.name",
            iconUrl: "$category.iconUrl",
            imageUrl: "$category.imageUrl",
          },
        },
      },
    ];

    const [result] = await this.model.aggregate<BookingDetailsEntity>(pipeline).exec();
    return result;
  }

  async getAllBookings(
    query: AdminBookingListParams
  ): Promise<{ bookings: BookingCardEntity[]; total: number }> {
    const { search, limit, page, paymentStatus, status } = query;
    const skip = (page - 1) * limit;

    const matchFilter: FilterQuery<IBooking> = {};
    if (search?.trim()) {
      matchFilter.bookingId = { $regex: search.trim(), $options: "i" };
    }
    if (status && status !== "all") {
      if (status === "upcoming") {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        matchFilter.status = {
          $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED] as BookingStatus[],
        };
        matchFilter.date = { $gte: todayStart };
      } else {
        matchFilter.status = status as BookingStatus;
      }
    }
    if (paymentStatus && paymentStatus !== "all") {
      matchFilter.paymentStatus = paymentStatus as BookingPaymentStatus;
    }
    const pipeline: PipelineStage[] = [
      { $match: matchFilter },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "bookingUser",
        },
      },
      { $unwind: { path: "$bookingUser", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "workers",
          localField: "workerId",
          foreignField: "_id",
          as: "worker",
        },
      },
      { $unwind: { path: "$worker", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "worker.userId",
          foreignField: "_id",
          as: "workerUser",
        },
      },
      { $unwind: { path: "$workerUser", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          bookingId: 1,
          date: 1,
          startTime: 1,
          endTime: 1,
          duration: 1,
          address: 1,
          total: 1,
          status: 1,
          paymentStatus: 1,
          extraCharge: 1,
          evidence: 1,
          isReviewed: 1,
          statusHistory: 1,
          userNote: 1,
          adminNote: 1,
          workerNote: 1,
          createdAt: 1,
          user: {
            _id: "$bookingUser._id",
            name: "$bookingUser.name",
            profileImage: "$bookingUser.profileImage",
          },
          worker: {
            _id: "$worker._id",
            displayName: "$worker.displayName",
            tagline: "$worker.tagline",
            coverImage: "$worker.coverImage",
            profileImage: "$workerUser.profileImage",
            isPremium: "$worker.isPremium",
            averageRating: "$worker.averageRating",
            reviewCount: "$worker.reviewCount",
            worksCompleted: "$worker.worksCompleted",
          },
          category: {
            _id: "$category._id",
            name: "$category.name",
            iconUrl: "$category.iconUrl",
          },
        },
      },
    ];

    const [bookings, total] = await Promise.all([
      this.model.aggregate<BookingCardEntity>(pipeline).exec(),
      this.model.countDocuments(matchFilter),
    ]);

    return { bookings, total };
  }

  async getUserBookings(
    userId: string,
    query: BookingListParams
  ): Promise<PaginatedBookingsEntity> {
    return this.paginatedQuery("userId", userId, query);
  }
  async getWorkerBookings(
    workerId: string,
    query: BookingListParams
  ): Promise<PaginatedBookingsEntity> {
    return this.paginatedQuery("workerId", workerId, query);
  }

  private async paginatedQuery(
    ownerField: "userId" | "workerId",
    ownerId: string,
    query: BookingListParams
  ): Promise<PaginatedBookingsEntity> {
    const { status, cursor, limit, sort } = query;

    const dir: 1 | -1 = sort === "asc" ? 1 : -1;

    const statusFilter = this.buildStatusFilter(ownerField, ownerId, status);
    const cursorFilter = this.buildCursorFilter(cursor, sort);

    const finalFilter: FilterQuery<IBooking> = {
      ...statusFilter,
      ...(cursor ? cursorFilter : {}),
    };

    const pipeline: PipelineStage[] = [
      { $match: finalFilter },
      { $sort: { date: dir, startTime: dir, _id: dir } },
      { $limit: limit + 1 },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "bookingUser",
        },
      },
      {
        $unwind: {
          path: "$bookingUser",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "workers",
          localField: "workerId",
          foreignField: "_id",
          as: "worker",
        },
      },
      {
        $unwind: {
          path: "$worker",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "worker.userId",
          foreignField: "_id",
          as: "workerUser",
        },
      },
      {
        $unwind: {
          path: "$workerUser",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          bookingId: 1,

          date: 1,
          startTime: 1,
          endTime: 1,
          duration: 1,

          address: 1,
          total: 1,
          status: 1,
          paymentStatus: 1,

          extraCharge: 1,
          evidence: 1,
          isReviewed: 1,
          statusHistory: 1,
          userNote: 1,
          createdAt: 1,

          user: {
            _id: "$bookingUser._id",
            name: "$bookingUser.name",
            profileImage: "$bookingUser.profileImage",
          },

          worker: {
            _id: "$worker._id",
            displayName: "$worker.displayName",
            tagline: "$worker.tagline",
            coverImage: "$worker.coverImage",
            profileImage: "$workerUser.profileImage",
            isPremium: "$worker.isPremium",
            averageRating: "$worker.averageRating",
            reviewCount: "$worker.reviewCount",
            worksCompleted: "$worker.worksCompleted",
          },

          category: {
            _id: "$category._id",
            name: "$category.name",
            iconUrl: "$category.iconUrl",
          },
        },
      },
    ];

    const docs = await this.model.aggregate<BookingCardEntity>(pipeline).exec();
    const hasMore = docs.length > limit;
    if (hasMore) docs.pop();

    let nextCursor: string | null = null;

    if (hasMore && docs.length > 0) {
      const last = docs[docs.length - 1];
      const payload: BookingCursor = {
        date: new Date(last.date).toISOString(),
        startTime: last.startTime,
        _id: last._id.toString(),
      };
      nextCursor = Buffer.from(JSON.stringify(payload)).toString("base64url");
    }
    let total: number | undefined;
    if (!cursor) {
      total = await this.model.countDocuments(statusFilter);
    }
    return {
      data: docs,
      cursor: nextCursor,
      hasMore,
      total,
    };
  }

  private buildCursorFilter(
    cursor: BookingCursor | null,
    sort: "asc" | "desc"
  ): FilterQuery<IBooking> {
    if (!cursor) return {};
    const cursorDate = new Date(cursor.date);
    const cursorId = new Types.ObjectId(cursor._id);

    if (sort === "asc") {
      return {
        $or: [
          { date: { $gt: cursorDate } },
          { date: cursorDate, startTime: { $gt: cursor.startTime } },
          {
            date: cursorDate,
            startTime: cursor.startTime,
            _id: { $gt: cursorId },
          },
        ],
      };
    }
    return {
      $or: [
        { date: { $lt: cursorDate } },
        { date: cursorDate, startTime: { $lt: cursor.startTime } },
        {
          date: cursorDate,
          startTime: cursor.startTime,
          _id: { $lt: cursorId },
        },
      ],
    };
  }

  private buildStatusFilter(
    ownerField: "userId" | "workerId",
    ownerId: string,
    status: string
  ): FilterQuery<IBooking> {
    const base: FilterQuery<IBooking> = {
      [ownerField]: new Types.ObjectId(ownerId),
    };
    if (!status || status === "all") return base;
    if (status === "upcoming") {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      return {
        ...base,
        status: {
          $in: [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED] as BookingStatus[],
        },
        date: { $gte: todayStart },
      };
    }
    return {
      ...base,
      status: status as BookingStatus,
    };
  }
}
