import { FilterQuery } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IHomeSection } from "@/models/homeSection.model";

export interface IHomeSectionRepository extends BaseRepository<IHomeSection> {
  getAllSections(
    skip: number,
    limit: number,
    filter: FilterQuery<IHomeSection>
  ): Promise<IHomeSection[]>;
}
