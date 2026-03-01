import { inject, injectable } from "inversify";
import { FilterQuery, Types } from "mongoose";

import redisClient from "@/config/redisClient";
import { HTTPSTATUS, PLAN, REDIS_EXPIRY } from "@/constants";
import { IPlanRepository } from "@/core/interfaces/repositories/IPlanRepository";
import { IPlanService } from "@/core/interfaces/services/IPlanService";
import { TYPES } from "@/di/types";
import { PlanRequestDTO } from "@/dtos/requests/plan.dto";
import { PlanResponseDTO } from "@/dtos/responses/plan.dto";
import { IPlan } from "@/types/plan";
import { ListBaseParams } from "@/types/query";
import { buildPlanFilter } from "@/utils/admin/filters/buildPlanFilter";
import { clearRedisListCache } from "@/utils/cache.util";
import CustomError from "@/utils/customError";
import { getEntityOrThrow } from "@/utils/getEntityOrThrow";

@injectable()
export class PlanService implements IPlanService {
  constructor(@inject(TYPES.PlanRepository) private _planRepository: IPlanRepository) {}
  async createPlan(data: PlanRequestDTO): Promise<PlanResponseDTO> {
    const { validTill, validFrom, name, isSpecialOffer } = data;
    const isAlreadyExists = await this._planRepository.findOne({ name });
    if (isAlreadyExists) {
      throw new CustomError(PLAN.EXISTS, HTTPSTATUS.FORBIDDEN);
    }
    const premium = await this._planRepository.findOne({ isSpecialOffer: false, isActive: true });
    if (premium && !isSpecialOffer) {
      throw new CustomError(PLAN.ONLY_ONE_PREMIUM, HTTPSTATUS.FORBIDDEN);
    }
    if (!premium && isSpecialOffer) {
      throw new CustomError(PLAN.PREMIUM_REQUIRED, HTTPSTATUS.FORBIDDEN);
    }
    if (isSpecialOffer) {
      await this._checkSpecialOfferOverlap(validFrom, validTill);
    }
    const plan = await this._planRepository.create(data);
    clearRedisListCache("plans:list");
    return PlanResponseDTO.fromEntity(plan);
  }

  async updatePlan(planId: string, data: PlanRequestDTO): Promise<PlanResponseDTO> {
    const existingPlan = await this._planRepository.findById(planId);
    if (!existingPlan) {
      throw new CustomError(PLAN.NOT_FOUND, HTTPSTATUS.NOT_FOUND);
    }
    const updates: Partial<IPlan> = {};
    const { name, isSpecialOffer, validFrom, validTill, ...rest } = data;

    if (name !== existingPlan.name) {
      const duplicate = await this._planRepository.findOne({ name });
      if (duplicate) {
        throw new CustomError(PLAN.EXISTS, HTTPSTATUS.CONFLICT);
      }
      updates.name = name;
    }

    if (isSpecialOffer !== existingPlan.isSpecialOffer) {
      const premiumExists = await this._planRepository.findOne({ isSpecialOffer: false });
      if (premiumExists && !isSpecialOffer) {
        throw new CustomError(PLAN.ONLY_ONE_PREMIUM, HTTPSTATUS.CONFLICT);
      }
      if (isSpecialOffer) {
        if (!premiumExists) {
          throw new CustomError(PLAN.PREMIUM_REQUIRED, HTTPSTATUS.CONFLICT);
        }
        if (existingPlan.id === premiumExists.id) {
          throw new CustomError(PLAN.TYPE_CHANGE_NOT_ALLOWED, HTTPSTATUS.CONFLICT);
        }
      }
      updates.isSpecialOffer = isSpecialOffer;
    }
    if (isSpecialOffer) {
      await this._checkSpecialOfferOverlap(validFrom, validTill, planId);
    }
    if (validFrom) updates.validFrom = validFrom;
    if (validTill) updates.validTill = validTill;
    Object.assign(updates, rest);
    const updatedPlan = await this._planRepository.update(planId, updates);
    clearRedisListCache("plans:list");
    return PlanResponseDTO.fromEntity(updatedPlan!);
  }

  async getPlanById(planId: string): Promise<PlanResponseDTO> {
    const plan = await getEntityOrThrow(this._planRepository, planId, PLAN.NOT_FOUND);
    return PlanResponseDTO.fromEntity(plan);
  }

  async getPlans({
    page,
    limit,
    search,
    status,
  }: ListBaseParams): Promise<{ total: number; plans: PlanResponseDTO[] }> {
    const cacheKey = `plans:list:${status}:${page}:${limit}:${search || "all"}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const query = buildPlanFilter(search, status);
    const [rowPlans, total] = await Promise.all([
      this._planRepository.getAllPlans({ page, limit, search, status }),
      this._planRepository.countDocuments(query),
    ]);

    const plans = PlanResponseDTO.fromEntities(rowPlans);
    const response = { plans, total };

    await redisClient.set(cacheKey, JSON.stringify(response), { EX: REDIS_EXPIRY });
    return response;
  }

  private async _checkSpecialOfferOverlap(
    validFrom: Date | undefined,
    validTill: Date | undefined,
    excludePlanId?: string
  ): Promise<void> {
    const now = new Date();
    if (validFrom && validFrom <= now) {
      throw new CustomError(PLAN.VALID_FROM_FUTURE, HTTPSTATUS.BAD_REQUEST);
    }
    if (!validTill) throw new CustomError(PLAN.VALID_TILL_REQUIRED, HTTPSTATUS.BAD_REQUEST);
    if (validTill <= now) {
      throw new CustomError(PLAN.VALID_TILL_FUTURE, HTTPSTATUS.BAD_REQUEST);
    }
    if (validFrom && validTill <= validFrom) {
      throw new CustomError(PLAN.INVALID_DATE_RANGE, HTTPSTATUS.BAD_REQUEST);
    }
    const newFrom = validFrom ? validFrom : new Date();

    const filter: FilterQuery<IPlan> = {
      isSpecialOffer: true,
      isActive: true,
      validTill: { $gt: newFrom },
      $or: [{ validFrom: { $lt: validTill } }, { validFrom: { $exists: false } }],
    };
    if (excludePlanId) {
      filter._id = { $ne: new Types.ObjectId(excludePlanId) };
    }
    const overlappingExists = await this._planRepository.findOne(filter);

    if (overlappingExists) {
      throw new CustomError(PLAN.OFFER_DATE_OVERLAP, HTTPSTATUS.CONFLICT);
    }
  }
}
