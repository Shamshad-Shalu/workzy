import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { AUTH, HTTPSTATUS } from "@/constants";
import { SERVICE } from "@/constants/messages/service";
import { IServiceController } from "@/core/interfaces/controllers/IServiceController";
import { IServiceManagement } from "@/core/interfaces/services/IServiceManagement";
import { TYPES } from "@/di/types";
import { ServiceRequestDTO } from "@/dtos/requests/service.dto";
import CustomError from "@/utils/customError";

@injectable()
export class ServiceController implements IServiceController {
  constructor(@inject(TYPES.ServiceManagement) private _serviceMangement: IServiceManagement) {}
  createService = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const data = req.body as ServiceRequestDTO;
    const service = await this._serviceMangement.createService(workerId, data);

    res.status(HTTPSTATUS.CREATED).json({ message: SERVICE.CREATED, service });
  });

  updateService = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const { serviceId } = req.params;
    const data = req.body as ServiceRequestDTO;
    const service = await this._serviceMangement.updateService(workerId, serviceId, data);

    res.status(HTTPSTATUS.OK).json({ message: SERVICE.UPDATED, service });
  });

  toggleStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const { serviceId } = req.params;
    const { newStatus, message } = await this._serviceMangement.updateServiceStatus(
      workerId,
      serviceId
    );

    res.status(HTTPSTATUS.OK).json({ message, isAvailable: newStatus });
  });

  getWorkerServices = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);

    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as "all" | "blocked" | "active") || "all";
    const categoryId = !req.query.categoryId ? null : (req.query.categoryId as string);
    const parsedCursor = req.query.cursor
      ? JSON.parse(Buffer.from(req.query.cursor as string, "base64url").toString("utf8"))
      : undefined;

    const { data, nextCursor } = await this._serviceMangement.getWorkerServices(workerId, {
      limit,
      search,
      status,
      categoryId,
      cursor: parsedCursor
        ? { _id: parsedCursor._id, createdAt: new Date(parsedCursor.createdAt) }
        : undefined,
    });
    res.status(HTTPSTATUS.OK).json({ services: data, nextCursor });
  });

  getWorkerServiceCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = this.requireWorkerId(req);
    const categories = await this._serviceMangement.getWorkerServiceFilters(workerId);
    res.status(HTTPSTATUS.OK).json({ categories });
  });

  private requireWorkerId(req: Request): string {
    if (!req.user?.workerId) {
      throw new CustomError(AUTH.UNAUTHORIZED, HTTPSTATUS.UNAUTHORIZED);
    }
    return req.user.workerId;
  }
}
