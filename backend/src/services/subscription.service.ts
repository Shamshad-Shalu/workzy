import { inject, injectable } from "inversify";

import { HTTPSTATUS, PLAN, SUBSCRIPTION, SUBSCRIPTION_STATUS } from "@/constants";
import { IPlanRepository } from "@/core/interfaces/repositories/IPlanRepository";
import { ISubscriptionRepository } from "@/core/interfaces/repositories/ISubscriptionRepository";
import { IPaymentService } from "@/core/interfaces/services/IPaymentService";
import { ISubscriptionService } from "@/core/interfaces/services/SubscriptionService";
import { TYPES } from "@/di/types";
import { AddSubscriptionRequestDTO } from "@/dtos/requests/subscription.dto";
import { SubscriptionStatusResponseDTO } from "@/dtos/responses/subscription.dto";
import CustomError from "@/utils/customError";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionRepository) private _subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES.PlanRepository) private _planRepository: IPlanRepository,
    @inject(TYPES.PaymentService) private _paymentService: IPaymentService
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
    const plan = await getEntityOrThrow(this._planRepository, planId, PLAN.NOT_FOUND);

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
    const name = `${plan.name} - ${billingCycle}`;
    const url = await this._paymentService.createSubscriptionCheckout({
      workerId,
      planId,
      amount,
      billingCycle,
      name,
    });
    return {
      url,
    };
  }
}
