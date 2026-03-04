import { BaseRepository } from "@/core/abstracts/base.repository";
import { IPayment } from "@/types/payment";

export interface IPaymentRepository extends BaseRepository<IPayment> {}
