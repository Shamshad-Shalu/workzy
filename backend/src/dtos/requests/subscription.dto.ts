import { IsEnum, IsMongoId } from "class-validator";

import { BILLING_CYCLE, BillingCycle } from "@/constants";

export class AddSubscriptionRequestDTO {
  @IsMongoId()
  planId!: string;

  @IsEnum(BILLING_CYCLE)
  billingCycle!: BillingCycle;
}
