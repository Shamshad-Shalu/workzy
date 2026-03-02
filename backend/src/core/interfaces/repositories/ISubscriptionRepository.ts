import { BaseRepository } from "@/core/abstracts/base.repository";
import { ISubscription, SubscriptionInfoEntity } from "@/types/subscription";

export interface ISubscriptionRepository extends BaseRepository<ISubscription> {
  findLatestByWorker(workerId: string): Promise<SubscriptionInfoEntity | null>;
}
