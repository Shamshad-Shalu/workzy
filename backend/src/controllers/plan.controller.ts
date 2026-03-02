import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { HTTPSTATUS, PLAN } from "@/constants";
import { IPlanController } from "@/core/interfaces/controllers/IPlanController";
import { IPlanService } from "@/core/interfaces/services/IPlanService";
import { TYPES } from "@/di/types";
import { PlanRequestDTO } from "@/dtos/requests/plan.dto";

@injectable()
export class PlanController implements IPlanController {
  constructor(@inject(TYPES.PlanService) private _planService: IPlanService) {}

  createPlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const plan = await this._planService.createPlan(req.body as PlanRequestDTO);
    res.status(HTTPSTATUS.CREATED).json({ message: PLAN.CREATED, plan });
  });

  updatePlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { planId } = req.params;
    const data = req.body as PlanRequestDTO;
    const plan = await this._planService.updatePlan(planId, data);
    res.status(HTTPSTATUS.CREATED).json({ message: PLAN.UPDATED, plan });
  });

  getPlan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { planId } = req.params;
    const plan = await this._planService.getPlanById(planId);
    res.status(HTTPSTATUS.OK).json(plan);
  });

  getAllPlans = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(100, Number(req.query.limit) || 5);
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "all";
    const { plans, total } = await this._planService.getPlans({ page, limit, search, status });

    res.status(HTTPSTATUS.OK).json({
      plans,
      total,
    });
  });
  getActiveOffers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { premium, special } = await this._planService.getActiveOffers();
    res.status(HTTPSTATUS.CREATED).json({ premium, special });
  });
}
