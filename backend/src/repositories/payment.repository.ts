import { injectable } from "inversify";
import { FilterQuery, Types } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IPaymentRepository } from "@/core/interfaces/repositories/IPaymentRepository";
import Payment from "@/models/payment.model";
import { IPayment, PaymentListQuery } from "@/types/payment";

@injectable()
export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
  constructor() {
    super(Payment);
  }
  async getPayments(
    filter: PaymentListQuery
  ): Promise<{ payments: IPayment[]; nextCursor: string | null }> {
    const {
      limit,
      billType,
      cursor,
      fromDate,
      toDate,
      maxAmount,
      minAmount,
      search,
      status,
      userId,
      workerId,
    } = filter;

    const query: FilterQuery<IPayment> = {};
    const andConditions: FilterQuery<IPayment>[] = [];

    if (userId) query.userId = new Types.ObjectId(userId);
    if (workerId) query.workerId = new Types.ObjectId(workerId);

    if (billType && billType !== "all") {
      query.billType = billType;
    }
    if (status && status !== "all") {
      query.status = status;
    }
    if (fromDate || toDate) {
      query.createdAt = {
        ...(fromDate && { $gte: fromDate }),
        ...(toDate && { $lte: toDate }),
      };
    }

    if (minAmount || maxAmount) {
      query.amount = {
        ...(minAmount && { $gte: minAmount }),
        ...(maxAmount && { $lte: maxAmount }),
      };
    }
    if (search) {
      andConditions.push({
        $or: [
          { transactionId: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
          { userName: { $regex: search, $options: "i" } },
          { workerName: { $regex: search, $options: "i" } },
        ],
      });
    }

    if (cursor) {
      andConditions.push({
        $or: [
          { createdAt: { $lt: cursor.createdAt } },
          {
            createdAt: cursor.createdAt,
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
        "transactionId title amount status billType failureReason createdAt userId workerId userName workerName platformFee workerAmount"
      )
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean<IPayment[]>();

    let nextCursor: string | null = null;

    if (docs.length > limit) {
      docs.pop();
      const last = docs[docs.length - 1];

      nextCursor = Buffer.from(
        JSON.stringify({
          createdAt: last.createdAt.toISOString(),
          _id: last._id.toString(),
        })
      ).toString("base64url");
    }
    return {
      payments: docs,
      nextCursor,
    };
  }
}
