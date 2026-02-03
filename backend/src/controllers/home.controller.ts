import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { inject, injectable } from "inversify";

import { HOME_SECTION, HTTPSTATUS } from "@/constants";
import { IHomeController } from "@/core/interfaces/controllers/IHomeController";
import { IHomeLayoutService } from "@/core/interfaces/services/IHomeLayoutService";
import { IHomeSectionService, ListType } from "@/core/interfaces/services/IHomeSectionService";
import { TYPES } from "@/di/types";
import {
  HomeSectionRequestDTO,
  HomeSectionUpdateRequestDTO,
} from "@/dtos/requests/admin/homeSection.dto";

@injectable()
export class HomeController implements IHomeController {
  constructor(
    @inject(TYPES.HomeLayoutService) private _homeLayoutService: IHomeLayoutService,
    @inject(TYPES.HomeSectionService) private _homeSectionService: IHomeSectionService
  ) {}

  getHome = asyncHandler(async (req: Request, res: Response): Promise<void> => {});

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

  //   getLayout = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
  //   addToLayout = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
  //   removeFromLayout = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
  //   saveLayout = asyncHandler(async (req: Request, res: Response): Promise<void> => {});
}
