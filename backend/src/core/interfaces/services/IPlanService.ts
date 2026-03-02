import { PlanRequestDTO } from "@/dtos/requests/plan.dto";
import { PlanResponseDTO } from "@/dtos/responses/plan.dto";
import { ListBaseParams } from "@/types/query";

export interface IPlanService {
  createPlan(data: PlanRequestDTO): Promise<PlanResponseDTO>;
  updatePlan(planId: string, data: PlanRequestDTO): Promise<PlanResponseDTO>;
  getPlanById(planId: string): Promise<PlanResponseDTO>;
  getPlans({
    page,
    limit,
    search,
    status,
  }: ListBaseParams): Promise<{ total: number; plans: PlanResponseDTO[] }>;
  getActiveOffers(): Promise<{ premium: PlanResponseDTO; special: PlanResponseDTO | null }>;
}
