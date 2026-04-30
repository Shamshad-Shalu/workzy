import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { HOME_LAYOUT, HOME_SECTION, HTTPSTATUS } from "@/constants";
import { IHomeController } from "@/core/interfaces/controllers/IHomeController";
import { IHomeLayoutService } from "@/core/interfaces/services/IHomeLayoutService";
import { IHomeSectionService, ListType } from "@/core/interfaces/services/IHomeSectionService";
import { IHomeService } from "@/core/interfaces/services/IHomeService";
import { IWorkerService } from "@/core/interfaces/services/IWorkerService";
import { TYPES } from "@/di/types";
import { SaveLayoutDTO } from "@/dtos/requests/admin/homeLayout.request.dto";
import {
  HomeSectionRequestDTO,
  HomeSectionUpdateRequestDTO,
} from "@/dtos/requests/admin/homeSection.dto";
import CustomError from "@/utils/customError";

@injectable()
export class HomeController implements IHomeController {
  constructor(
    @inject(TYPES.HomeLayoutService) private _homeLayoutService: IHomeLayoutService,
    @inject(TYPES.HomeSectionService) private _homeSectionService: IHomeSectionService,
    @inject(TYPES.HomeService) private _homeService: IHomeService,
    @inject(TYPES.WorkerService) private _workerService: IWorkerService
  ) {}

  getHome = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const home = await this._homeService.getHome();
    res.status(HTTPSTATUS.OK).json(home);
  });

  getNearbyWorkers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const radius = Number(req.query.radius ?? 150);
    const limit = Number(req.query.limit ?? 10);

    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);

    if (isNaN(lat) || isNaN(lng)) {
      throw new CustomError("Invalid query parameters", HTTPSTATUS.BAD_REQUEST);
    }
    const workers = await this._workerService.listNearbyWorkers({ lat, lng, radius, limit });
    res.status(HTTPSTATUS.OK).json({ workers });
  });

  listSections = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "all";
    const type = ((req.query.type as string) || "all") as ListType;

    const { sections, total } = await this._homeSectionService.listSections(
      page,
      limit,
      search,
      status,
      type
    );

    res.status(HTTPSTATUS.OK).json({ sections, total });
  });
  createSection = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = req.body as HomeSectionRequestDTO;
    const section = await this._homeSectionService.createSection(data);
    res.status(HTTPSTATUS.CREATED).json({ message: HOME_SECTION.CREATED, section });
  });

  updateSection = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { sectionId } = req.params;
    const data = req.body as HomeSectionUpdateRequestDTO;

    const section = await this._homeSectionService.updateSection(sectionId, data);
    res.status(HTTPSTATUS.OK).json({ message: HOME_SECTION.UPDATED, section });
  });

  toggleSectionStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { sectionId } = req.params;
    const { message } = await this._homeSectionService.toggleStatus(sectionId);
    res.status(HTTPSTATUS.OK).json({ message });
  });

  deleteSection = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { sectionId } = req.params;
    const message = await this._homeSectionService.deleteSection(sectionId);
    res.status(HTTPSTATUS.OK).json({ message });
  });

  getLayout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const layout = await this._homeLayoutService.getLayout();
    res.status(HTTPSTATUS.OK).json({ layout });
  });
  saveLayout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as SaveLayoutDTO;
    const layout = await this._homeLayoutService.saveLayout(dto.items);
    res.status(HTTPSTATUS.OK).json({ message: HOME_LAYOUT.SAVED, layout });
  });
}
