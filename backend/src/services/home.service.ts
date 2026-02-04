import { inject, injectable } from "inversify";

import redisClient from "@/config/redisClient";
import { REFRESH_TOKEN_TTL_SECONDS } from "@/constants";
import { HOME_SECTION_TYPE } from "@/constants/home";
import { IHomeLayoutRepository } from "@/core/interfaces/repositories/IHomeLayoutRepository";
import { IHomeSectionRepository } from "@/core/interfaces/repositories/IHomeSectionRepository";
import { IHomeService } from "@/core/interfaces/services/IHomeService";
import { TYPES } from "@/di/types";
import { PublicHomeResponseDTO } from "@/dtos/responses/home.response.dto";
import { IHomeSectionWithOrder } from "@/types/home";

@injectable()
export class HomeService implements IHomeService {
  constructor(
    @inject(TYPES.HomeLayoutRepository) private _layoutRepo: IHomeLayoutRepository,
    @inject(TYPES.HomeSectionRepository) private readonly _sectionRepo: IHomeSectionRepository
  ) {}

  async getHome(): Promise<PublicHomeResponseDTO> {
    const cacheKey = "home:public";
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const sections = await this._layoutRepo.getPublicHomeLayout();

    const heroSection = sections.find((s) => s.type === HOME_SECTION_TYPE.HERO);
    const otherSections = sections.filter((s) => s.type !== HOME_SECTION_TYPE.HERO);

    const fullSections: IHomeSectionWithOrder[] = [...otherSections];

    if (heroSection) {
      const heroWithCategories = await this._sectionRepo.getHeroSectionForHome(heroSection._id);

      if (heroWithCategories) {
        fullSections.push({
          ...heroWithCategories,
          order: heroSection.order,
        } as IHomeSectionWithOrder);
      }
    }

    fullSections.sort((a, b) => a.order - b.order);

    const response = PublicHomeResponseDTO.fromEntities(fullSections);
    await redisClient.set(cacheKey, JSON.stringify(response), {
      EX: REFRESH_TOKEN_TTL_SECONDS,
    });
    return response;
  }
}
