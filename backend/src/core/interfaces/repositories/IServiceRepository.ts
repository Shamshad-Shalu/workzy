import { BaseRepository } from "@/core/abstracts/base.repository";
import { IService } from "@/types/service";
import { FilterQuery } from "mongoose";

export interface IServiceRepository extends BaseRepository<IService> {
  countDocuments(filter: FilterQuery<IService>): Promise<number>;
  getAllServices(
    skip: number,
    limit: number,
    search: string,
    status: string,
    parentId: string | null
  ): Promise<IService[]>;
}
