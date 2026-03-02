import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, HTTPSTATUS } from "@/constants";
import { ISubscriptionController } from "@/core/interfaces/controllers/ISubscriptionController";
import { ISubscriptionService } from "@/core/interfaces/services/SubscriptionService";
import { TYPES } from "@/di/types";
import CustomError from "@/utils/customError";

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject(TYPES.SubscriptionService) private _subscriptionService: ISubscriptionService
  ) {}

  getMySubscription = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.workerId;
    if (!workerId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    const { subscription } = await this._subscriptionService.getMySubscription(workerId);
    res.status(HTTPSTATUS.OK).json({ data: subscription });
  });
}
