import { BaseRepository } from "@/core/abstracts/base.repository";
import { IService } from "@/types/service";

export interface IServiceRepository extends BaseRepository<IService> {
  getAllServices(
    skip: number,
    limit: number,
    search: string,
    status: string,
    parentId: string | null
  ): Promise<IService[]>;
}
