import { injectable } from "inversify";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IPaymentRepository } from "@/core/interfaces/repositories/IPaymentRepository";
import Payment from "@/models/payment.model";
import { IPayment } from "@/types/payment";

@injectable()
export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
  constructor() {
    super(Payment);
  }
}
