import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { HTTPSTATUS, LEAVE, WORKER } from "@/constants";
import { ILeaveController } from "@/core/interfaces/controllers/ILeaveController";
import { ILeaveService } from "@/core/interfaces/services/ILeaveService";
import { TYPES } from "@/di/types";
import { CreateLeaveDTO } from "@/dtos/requests/leave.dto";
import { LeaveFilter } from "@/types/leave";
import CustomError from "@/utils/customError";

@injectable()
export class LeaveController implements ILeaveController {
  constructor(@inject(TYPES.LeaveService) private _leaveService: ILeaveService) {}

  createLeave = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.workerId;
    if (!workerId) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.UNAUTHORIZED);
    }
    const data = req.body as CreateLeaveDTO;
    const leave = await this._leaveService.createLeave(workerId, data);
    res.status(HTTPSTATUS.CREATED).json({ message: LEAVE.CREATED, data: leave });
  });

  cancelLeave = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.workerId;
    if (!workerId) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.UNAUTHORIZED);
    }
    const { leaveId } = req.params;
    await this._leaveService.cancelLeave(leaveId, workerId);

    res.status(HTTPSTATUS.OK).json({ message: LEAVE.CANCELLED });
  });

  getWorkerLeaves = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.workerId;
    if (!workerId) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.UNAUTHORIZED);
    }
    const filter = (req.query.filter as LeaveFilter) || "all";
    const cursor = (req.query.cursor as string) ?? null;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const results = await this._leaveService.getWorkerLeaves({ workerId, cursor, filter, limit });
    res.status(HTTPSTATUS.OK).json(results);
  });

  getWorkerLeaveStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.workerId;
    if (!workerId) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.UNAUTHORIZED);
    }
    const results = await this._leaveService.getLeaveStats(workerId);
    res.status(HTTPSTATUS.OK).json(results);
  });
}
