import { BaseRepository } from "@/core/abstracts/base.repository";
import { PaymentListQuery } from "@/types/payment/booking.query";
import { IPayment } from "@/types/payment/payment.entity";

export interface IPaymentRepository extends BaseRepository<IPayment> {
  getPayments(
    filter: PaymentListQuery
  ): Promise<{ payments: IPayment[]; nextCursor: string | null }>;
}
