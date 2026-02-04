import { injectable } from "inversify";
import { Types } from "mongoose";

import { HomeSectionType } from "@/constants/home";
import { BaseRepository } from "@/core/abstracts/base.repository";
import { IHomeLayoutRepository } from "@/core/interfaces/repositories/IHomeLayoutRepository";
import HomeLayout, { IHomeLayout } from "@/models/homeLayout.model";
import { IHomeSection } from "@/models/homeSection.model";
import { IHomeLayoutEntity, IHomeSectionWithOrder } from "@/types/home";

@injectable()
export class HomeLayoutRepository
  extends BaseRepository<IHomeLayout>
  implements IHomeLayoutRepository
{
  constructor() {
    super(HomeLayout);
  }
  async upsertHomeLayout(): Promise<IHomeLayout> {
    return this.model.findOneAndUpdate(
      { key: "HOME" },
      { $setOnInsert: { key: "HOME", items: [] } },
      { upsert: true, new: true }
    );
  }
  async getLayout(): Promise<IHomeLayoutEntity[]> {
    type PopulatedSection = { _id: Types.ObjectId; name: string; type: HomeSectionType };
    type PopulatedItem = { sectionId: PopulatedSection; order: number };

    await this.upsertHomeLayout();

    const layout = (await this.model
      .findOne({ key: "HOME" })
      .populate("items.sectionId", "name type")
      .lean()) as { items: PopulatedItem[] } | null;

    if (!layout) return [];

    return layout.items.map((item) => ({
      sectionId: item.sectionId._id,
      order: item.order,
      name: item.sectionId.name,
      type: item.sectionId.type,
    }));
  }

  async getPublicHomeLayout(): Promise<IHomeSectionWithOrder[]> {
    await this.upsertHomeLayout();

    type PopulatedLayoutItem = {
      sectionId: IHomeSection | null;
      order: number;
    };

    const layout = (await this.model
      .findOne({ key: "HOME" })
      .populate({
        path: "items.sectionId",
        match: { isActive: true },
      })
      .lean()) as { items: PopulatedLayoutItem[] } | null;

    if (!layout || !layout.items) return [];

    return layout.items
      .filter((item): item is { sectionId: IHomeSection; order: number } => item.sectionId !== null)
      .map((item) => ({
        ...item.sectionId,
        order: item.order,
      })) as IHomeSectionWithOrder[];
  }
}
