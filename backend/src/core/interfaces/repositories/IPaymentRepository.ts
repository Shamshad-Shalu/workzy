import { BaseRepository } from "@/core/abstracts/base.repository";
import { IPayment, PaymentListQuery } from "@/types/payment";

export interface IPaymentRepository extends BaseRepository<IPayment> {
  getPayments(
    filter: PaymentListQuery
  ): Promise<{ payments: IPayment[]; nextCursor: string | null }>;
}
