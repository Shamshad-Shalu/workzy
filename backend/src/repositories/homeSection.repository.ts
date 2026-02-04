import { injectable } from "inversify";
import { FilterQuery, Types } from "mongoose";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { IHomeSectionRepository } from "@/core/interfaces/repositories/IHomeSectionRepository";
import HomeSection, { IHomeSection } from "@/models/homeSection.model";
import { IHeroSectionData } from "@/types/home";

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

  async getHeroSectionForHome(sectionId: Types.ObjectId): Promise<IHomeSection | null> {
    const section = await this.model
      .findOne({
        _id: sectionId,
        isActive: true,
      })
      .lean();

    if (!section) return null;

    const data = section.data as IHeroSectionData;
    const categoryIds = data.slides.map((slide) => slide.categoryId);
    interface CategoryDoc {
      _id: Types.ObjectId;
      imageUrl?: string;
    }

    const categories = await this.model.db
      .collection<CategoryDoc>("categories")
      .find({ _id: { $in: categoryIds } })
      .toArray();

    const categoryMap = new Map(categories.map((cat) => [cat._id.toString(), cat]));

    const slides = data.slides.map((slide) => {
      const category = categoryMap.get(slide.categoryId.toString());
      return {
        categoryId: slide.categoryId,
        eyebrow: slide.eyebrow,
        title: slide.title,
        subTitle: slide.subTitle,
        description: slide.description,
        categoryImage: category?.imageUrl || "",
      };
    });

    return {
      ...section,
      data: {
        autoPlay: data.autoPlay,
        interval: data.interval,
        slides: slides,
      },
    } as unknown as IHomeSection;
  }
}
