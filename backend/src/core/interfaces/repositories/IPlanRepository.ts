import { BaseRepository } from "@/core/abstracts/base.repository";
import { IPlan } from "@/types/plan";
import { ListBaseParams } from "@/types/query";

export interface IPlanRepository extends BaseRepository<IPlan> {
  getAllPlans({ page, limit, search, status }: ListBaseParams): Promise<IPlan[]>;
  findActivePremium(): Promise<IPlan | null>;
  findActiveSpecial(now: Date): Promise<IPlan | null>;
}
