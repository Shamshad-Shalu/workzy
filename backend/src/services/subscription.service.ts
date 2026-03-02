import { inject, injectable } from "inversify";

import { ISubscriptionRepository } from "@/core/interfaces/repositories/ISubscriptionRepository";
import { ISubscriptionService } from "@/core/interfaces/services/SubscriptionService";
import { TYPES } from "@/di/types";
import { SubscriptionStatusResponseDTO } from "@/dtos/responses/subscription.dto";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionRepository) private _subscriptionRepository: ISubscriptionRepository
  ) {}
  async getMySubscription(
    workerId: string
  ): Promise<{ subscription: SubscriptionStatusResponseDTO | null }> {
    const sub = await this._subscriptionRepository.findLatestByWorker(workerId);

    return {
      subscription: sub ? SubscriptionStatusResponseDTO.fromEntity(sub) : null,
    };
  }
}
