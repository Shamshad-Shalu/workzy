import { injectable } from "inversify";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { ISubscriptionRepository } from "@/core/interfaces/repositories/ISubscriptionRepository";
import subscriptionModel from "@/models/subscription.model";
import { ISubscription, SubscriptionInfoEntity } from "@/types/subscription";

@injectable()
export class SubscriptionRepository
  extends BaseRepository<ISubscription>
  implements ISubscriptionRepository
{
  constructor() {
    super(subscriptionModel);
  }
  findLatestByWorker(workerId: string): Promise<SubscriptionInfoEntity | null> {
    return this.model
      .findOne({ workerId })
      .sort({ createdAt: -1 })
      .populate("planId", "name description price isSpecialOffer")
      .lean()
      .exec() as Promise<SubscriptionInfoEntity | null>;
  }
}
