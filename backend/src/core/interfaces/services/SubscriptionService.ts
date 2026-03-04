import { AddSubscriptionRequestDTO } from "@/dtos/requests/subscription.dto";
import { SubscriptionStatusResponseDTO } from "@/dtos/responses/subscription.dto";

export interface ISubscriptionService {
  getMySubscription(
    workerId: string
  ): Promise<{ subscription: SubscriptionStatusResponseDTO | null }>;
  addSubscription(workerId: string, data: AddSubscriptionRequestDTO): Promise<{ url: string }>;
}
