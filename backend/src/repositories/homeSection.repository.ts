import { injectable } from "inversify";
import { FilterQuery } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IHomeSectionRepository } from "@/core/interfaces/repositories/IHomeSectionRepository";
import HomeSection, { IHomeSection } from "@/models/homeSection.model";

@injectable()
export class HomeSectionRepository
  extends BaseRepository<IHomeSection>
  implements IHomeSectionRepository
{
  constructor() {
    super(HomeSection);
  }
  getAllSections(
    skip: number,
    limit: number,
    filter: FilterQuery<IHomeSection>
  ): Promise<IHomeSection[]> {
    return this.model.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
  }
}
