import { IAdminServiceController } from "@/core/interfaces/controllers/admin/IAdminServiceController";
import { inject, injectable } from "inversify";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { TYPES } from "@/di/types";
import { IServiceManagementService } from "@/core/interfaces/services/admin/IServiceManagementService";
import { ServiceRequestDTO, ServiceUpdateRequestDTO } from "@/dtos/requests/service.dto";
import { HTTPSTATUS } from "@/constants";
import { SERVICE } from "@/constants/messages/service";
import CustomError from "@/utils/customError";

@injectable()
export class AdminServiceController implements IAdminServiceController {
  constructor(
    @inject(TYPES.ServiceManagementService) private _serviceManagement: IServiceManagementService
  ) {}

  createService = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const files = req.files as {
      iconUrl?: Express.Multer.File[];
      imageUrl?: Express.Multer.File[];
    };
    const iconFile = files.iconUrl?.[0];
    const imgFile = files.imageUrl?.[0];

    if (!iconFile || !imgFile) {
      throw new CustomError(SERVICE.MISSING_FILES, HTTPSTATUS.BAD_REQUEST);
    }

    const newService = await this._serviceManagement.createService(req.body as ServiceRequestDTO, {
      iconFile,
      imgFile,
    });
    res.status(HTTPSTATUS.CREATED).json({ message: SERVICE.CREATED, newService });
  });

  getServices = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "all";
    const parentId = !req.query.parentId ? null : (req.query.parentId as string);

    const { services, total } = await this._serviceManagement.getAllServices(
      page,
      limit,
      search,
      status,
      parentId
    );

    res.status(HTTPSTATUS.OK).json({
      services,
      total,
      page,
    });
  });

  updateService = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const serviceId = req.params.serviceId;
    const files = req.files as {
      iconUrl?: Express.Multer.File[];
      imageUrl?: Express.Multer.File[];
    };

    const iconFile = files.iconUrl?.[0];
    const imgFile = files.imageUrl?.[0];

    const updateData = req.body as ServiceUpdateRequestDTO;

    const updatedService = await this._serviceManagement.updateService(
      serviceId,
      updateData,
      iconFile,
      imgFile
    );

    res.status(HTTPSTATUS.OK).json({ message: SERVICE.UPDATED, updatedService });
  });

  toggleStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const serviceId = req.params.serviceId;
    const { newStatus, message } = await this._serviceManagement.toggleServiceStatus(serviceId);

    res.status(HTTPSTATUS.OK).json({ message, isAvailable: newStatus });
  });
}
