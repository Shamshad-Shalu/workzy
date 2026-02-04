import { FilterQuery, Types } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IHomeSection } from "@/models/homeSection.model";

export interface IHomeSectionRepository extends BaseRepository<IHomeSection> {
  getAllSections(
    skip: number,
    limit: number,
    filter: FilterQuery<IHomeSection>
  ): Promise<IHomeSection[]>;
  getHeroSectionForHome(sectionId: Types.ObjectId): Promise<IHomeSection | null>;
}
