import { IAdminServiceController } from "@/core/interfaces/controllers/admin/IAdminServiceController";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { TYPES } from "@/di/types";
import { IServiceManagementService } from "@/core/interfaces/services/admin/IServiceManagementService";
import { ServiceRequestDTO } from "@/dtos/requests/service.dto";
import { HTTPSTATUS } from "@/constants";
import { SERVICE } from "@/constants/messages/service";

@injectable()
export class AdminServiceController implements IAdminServiceController {
  constructor(
    @inject(TYPES.ServiceManagementService) private _serviceManagement: IServiceManagementService
  ) {}

  createService = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const newService = await this._serviceManagement.createService(req.body as ServiceRequestDTO);
    res.status(HTTPSTATUS.OK).json({ message: SERVICE.CREATED, newService });
  });

  getServices = asyncHandler(async (req: Request, res: Response): Promise<void> => {});

  updateService = asyncHandler(async (req: Request, res: Response): Promise<void> => {});

  deleteService = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
}
