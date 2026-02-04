import { BaseRepository } from "@/core/abstracts/base.repository";
import { IHomeLayout } from "@/models/homeLayout.model";
import { IHomeLayoutEntity, IHomeSectionWithOrder } from "@/types/home";

export interface IHomeLayoutRepository extends BaseRepository<IHomeLayout> {
  getLayout(): Promise<IHomeLayoutEntity[]>;
  upsertHomeLayout(): Promise<IHomeLayout>;
  getPublicHomeLayout(): Promise<IHomeSectionWithOrder[]>;
}
