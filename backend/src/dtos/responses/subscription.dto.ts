import { BillingCycle, SubscriptionStatus } from "@/constants";
import { IPlanPrice } from "@/types/plan";
import { SubscriptionInfoEntity } from "@/types/subscription";

export class SubscriptionStatusResponseDTO {
  id!: string;
  workerId!: string;
  planId!: string;
  billingCycle!: BillingCycle;
  amountPaid!: number;
  status!: SubscriptionStatus;
  startDate!: Date;
  expiryDate!: Date;
  cancelledAt?: Date;
  name!: string;
  description?: string;
  price!: IPlanPrice;
  isSpecialOffer!: boolean;

  static fromEntity(entity: SubscriptionInfoEntity): SubscriptionStatusResponseDTO {
    const dto = new SubscriptionStatusResponseDTO();

    dto.workerId = entity.workerId.toString();
    dto.id = entity._id.toString();
    dto.planId = entity.planId._id.toString();
    dto.name = entity.planId.name;
    dto.description = entity.planId.description;
    dto.price = entity.planId.price;
    dto.isSpecialOffer = entity.planId.isSpecialOffer;
    dto.billingCycle = entity.billingCycle;
    dto.amountPaid = entity.amountPaid;
    dto.status = entity.status;
    dto.startDate = entity.startDate;
    dto.expiryDate = entity.expiryDate;
    dto.cancelledAt = entity.cancelledAt;
    return dto;
  }
}
