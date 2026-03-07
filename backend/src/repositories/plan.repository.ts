import { injectable } from "inversify";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IPlanRepository } from "@/core/interfaces/repositories/IPlanRepository";
import planModel from "@/models/plan.model";
import { IPlan } from "@/types/plan";
import { ListBaseParams } from "@/types/query";
import { buildPlanFilter } from "@/utils/admin/filters/buildPlanFilter";

@injectable()
export class PlanRepository extends BaseRepository<IPlan> implements IPlanRepository {
  constructor() {
    super(planModel);
  }

  getAllPlans({ page, limit, search, status }: ListBaseParams): Promise<IPlan[]> {
    const skip = (page - 1) * limit;

    const filter = buildPlanFilter(search, status);
    return this.model.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
  }

  async findActivePremium(): Promise<IPlan | null> {
    return this.model.findOne({ isActive: true, isSpecialOffer: false, name: "Premium" });
  }
  async findActiveSpecial(now: Date): Promise<IPlan | null> {
    return this.model
      .findOne({
        isActive: true,
        isSpecialOffer: true,
        validFrom: { $lte: now },
        validTill: { $gte: now },
      })
      .sort({ createdAt: -1 });
  }

  async getAllPlanFromDate(validFrom: Date): Promise<IPlan[] | null> {
    return await this.model.find({ validFrom: { $gte: validFrom } });
  }
}
