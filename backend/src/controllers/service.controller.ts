import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { HTTPSTATUS, WORKER } from "@/constants";
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
    const workerId = req.user?.workerId;

    if (!workerId) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.UNAUTHORIZED);
    }
    const data = req.body as ServiceRequestDTO;
    const service = await this._serviceMangement.createService(workerId, data);

    res.status(HTTPSTATUS.CREATED).json({ message: SERVICE.CREATED, service });
  });

  updateService = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.workerId;
    const { serviceId } = req.params;

    if (!workerId) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.UNAUTHORIZED);
    }
    const data = req.body as ServiceRequestDTO;
    const service = await this._serviceMangement.updateService(workerId, serviceId, data);

    res.status(HTTPSTATUS.OK).json({ message: SERVICE.UPDATED, service });
  });

  toggleStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const workerId = req.user?.workerId;
    const { serviceId } = req.params;

    if (!workerId) {
      throw new CustomError(WORKER.NOT_FOUND, HTTPSTATUS.UNAUTHORIZED);
    }
    const { newStatus, message } = await this._serviceMangement.updateServiceStatus(
      workerId,
      serviceId
    );

    res.status(HTTPSTATUS.OK).json({ message, isAvailable: newStatus });
  });

  getWorkerServices = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { workerId } = req.params;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "all";
    const categoryId = !req.query.categoryId ? null : (req.query.categoryId as string);

    const { services, total } = await this._serviceMangement.getWorkerServices(
      workerId,
      page,
      limit,
      search,
      status,
      categoryId
    );
    res.status(HTTPSTATUS.OK).json({
      services,
      total,
    });
  });

  getWorkerServiceCategories = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { workerId } = req.params;
    const categories = await this._serviceMangement.getWorkerServiceFilters(workerId);
    res.status(HTTPSTATUS.OK).json({ categories });
  });
}
