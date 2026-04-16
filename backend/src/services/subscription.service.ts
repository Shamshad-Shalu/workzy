import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { HTTPSTATUS, PLAN, SUBSCRIPTION, SUBSCRIPTION_STATUS, WORKER } from "@/constants";
import { IPlanRepository } from "@/core/interfaces/repositories/IPlanRepository";
import { ISubscriptionRepository } from "@/core/interfaces/repositories/ISubscriptionRepository";
import { IWorkerRepository } from "@/core/interfaces/repositories/IWorkerRepository";
import { IPaymentService } from "@/core/interfaces/services/IPaymentService";
import { ISubscriptionService } from "@/core/interfaces/services/SubscriptionService";
import { TYPES } from "@/di/types";
import { AddSubscriptionRequestDTO } from "@/dtos/requests/subscription.dto";
import { SubscriptionStatusResponseDTO } from "@/dtos/responses/subscription.dto";
import CustomError from "@/utils/customError";
import { generateTxnCode } from "@/utils/generateTxnCode";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionRepository) private _subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES.PlanRepository) private _planRepository: IPlanRepository,
    @inject(TYPES.PaymentService) private _paymentService: IPaymentService,
    @inject(TYPES.WorkerRepository) private _workerRepo: IWorkerRepository
  ) {}
  async getMySubscription(
    workerId: string
  ): Promise<{ subscription: SubscriptionStatusResponseDTO | null }> {
    const sub = await this._subscriptionRepository.findLatestByWorker(workerId);
    return {
      subscription: sub ? SubscriptionStatusResponseDTO.fromEntity(sub) : null,
    };
  }

  async addSubscription(
    workerId: string,
    data: AddSubscriptionRequestDTO
  ): Promise<{ url: string }> {
    const { planId, billingCycle } = data;
    const [worker, plan] = await Promise.all([
      getEntityOrThrow(this._workerRepo, workerId, WORKER.NOT_FOUND),
      getEntityOrThrow(this._planRepository, planId, PLAN.NOT_FOUND),
    ]);
    const amount = plan.price[billingCycle];
    if (!amount) {
      throw new CustomError(SUBSCRIPTION.INVALID_BILLING, HTTPSTATUS.BAD_REQUEST);
    }
    const existing = await this._subscriptionRepository.findOne({
      workerId,
      // planId,
      status: SUBSCRIPTION_STATUS.ACTIVE,
    });
    if (existing) throw new CustomError(SUBSCRIPTION.ALREADY_EXISTS, HTTPSTATUS.CONFLICT);

    const startDate = new Date();
    const expiryDate = this._calcExpiry(startDate, billingCycle);

    const subscription = await this._subscriptionRepository.create({
      subscriptionId: generateTxnCode("SUB"),
      workerId: new Types.ObjectId(workerId),
      planId: new Types.ObjectId(planId),
      billingCycle,
      amountPaid: Number(amount),
      status: SUBSCRIPTION_STATUS.PENDING,
      startDate,
      expiryDate,
    });
    const name = `${plan.name} - ${billingCycle}`;
    const url = await this._paymentService.createSubscriptionCheckout({
      workerId,
      userId: worker.userId.toString(),
      subscriptionId: subscription._id.toString(),
      amount,
      name,
      userName: worker.displayName,
    });
    return {
      url,
    };
  }
  private _calcExpiry(start: Date, cycle: string): Date {
    const d = new Date(start);
    const map: Record<string, () => void> = {
      monthly: () => d.setMonth(d.getMonth() + 1),
      quarterly: () => d.setMonth(d.getMonth() + 3),
      halfYearly: () => d.setMonth(d.getMonth() + 6),
      yearly: () => d.setFullYear(d.getFullYear() + 1),
    };
    map[cycle]?.();
    return d;
  }
}
