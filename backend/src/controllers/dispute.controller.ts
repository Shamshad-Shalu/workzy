import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, DISPUTE, DisputeReason, DisputeStatus, HTTPSTATUS, Role, ROLE } from "@/constants";
import { IDisputeController } from "@/core/interfaces/controllers/IDisputeController";
import { IDisputeService } from "@/core/interfaces/services/IDisputeService";
import { TYPES } from "@/di/types";
import { CreateDisputeDto, ResolveDisputeDto } from "@/dtos/requests/dispute.dto";
import { DisputeListQuery } from "@/types/dispute/dispute.query";
import CustomError from "@/utils/customError";

@injectable()
export class DisputeController implements IDisputeController {
  constructor(@inject(TYPES.DisputeService) private _disputeService: IDisputeService) {}

  raiseDispute = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = req.body as CreateDisputeDto;
    const role = req.user?.role as Role;
    const initiatorId = role === ROLE.USER ? this.requireUserId(req) : this.requireWorkerId(req);
    const { bookingId } = req.params;

    const dispute = await this._disputeService.raiseDispute(bookingId, initiatorId, role, data);
    res.status(HTTPSTATUS.CREATED).json({ message: DISPUTE.RAISED, dispute });
  });

  getAllDisputes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = this.parseQuery(req);
    const { data, nextCursor } = await this._disputeService.getAllDisputes(query);
    res.status(HTTPSTATUS.OK).json({ disputes: data, nextCursor });
  });

  getDisputeStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = this.resolveActorIds(req);
    const stats = await this._disputeService.getDisputeStats(data);
    res.status(HTTPSTATUS.OK).json(stats);
  });

  getDisputeByBookingId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const dispute = await this._disputeService.getDisputeByBookingId(bookingId);
    res.status(HTTPSTATUS.OK).json(dispute);
  });

  updateDispute = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const role = req.user?.role as Role;
    const data = req.body as CreateDisputeDto;
    const initiatorId = role === ROLE.USER ? this.requireUserId(req) : this.requireWorkerId(req);
    const { disputeId } = req.params;
    const dispute = await this._disputeService.updateDispute(disputeId, initiatorId, role, data);
    res.status(HTTPSTATUS.OK).json({ message: DISPUTE.UPDATED, dispute });
  });

  resolveDispute = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminId = this.requireUserId(req);
    const { disputeId } = req.params;
    const data = req.body as ResolveDisputeDto;

    await this._disputeService.resolveDispute(disputeId, adminId, data);
    res.status(HTTPSTATUS.OK).json({ message: DISPUTE.RESOLVED });
  });

  private parseQuery(req: Request): DisputeListQuery {
    const { userId, workerId } = this.resolveActorIds(req);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 50);
    const search = (req.query.search as string) ?? "";
    const status = (req.query.status as DisputeStatus) ?? ("all" as DisputeStatus);
    const reason = (req.query.reason as DisputeReason) ?? ("all" as DisputeReason);

    const parsedCursor = req.query.cursor
      ? JSON.parse(Buffer.from(req.query.cursor as string, "base64url").toString("utf8"))
      : undefined;

    return {
      limit,
      cursor: parsedCursor,
      reason,
      search,
      status,
      userId,
      workerId,
    };
  }

  private resolveActorIds(req: Request): { userId?: string; workerId?: string } {
    const role = req.user?.role;
    if (role === ROLE.ADMIN) {
      return {
        userId: req.query.userId as string | undefined,
        workerId: req.query.workerId as string | undefined,
      };
    }

    if (role === ROLE.USER) return { userId: this.requireUserId(req) };
    if (role === ROLE.WORKER) return { workerId: this.requireWorkerId(req) };

    return {};
  }

  private requireUserId(req: Request): string {
    if (!req.user?.id) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    return req.user.id;
  }

  private requireWorkerId(req: Request): string {
    if (!req.user?.workerId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    return req.user.workerId;
  }
}
