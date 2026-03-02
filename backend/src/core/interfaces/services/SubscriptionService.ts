import { SubscriptionStatusResponseDTO } from "@/dtos/responses/subscription.dto";

export interface ISubscriptionService {
  getMySubscription(
    workerId: string
  ): Promise<{ subscription: SubscriptionStatusResponseDTO | null }>;
}
