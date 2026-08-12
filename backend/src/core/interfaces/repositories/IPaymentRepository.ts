import { BaseRepository } from "@/core/abstracts/base.repository";
import { CursorPaginatedResult } from "@/types/common/pagination";
import { IPayment } from "@/types/payment/payment.entity";
import { PaymentListQuery } from "@/types/payment/payment.query";

export interface IPaymentRepository extends BaseRepository<IPayment> {
  getPayments(filter: PaymentListQuery): Promise<CursorPaginatedResult<IPayment>>;
}
