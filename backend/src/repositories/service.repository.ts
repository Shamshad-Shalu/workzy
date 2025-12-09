import { BaseRepository } from "@/core/abstracts/base.repository";
import { IServiceRepository } from "@/core/interfaces/repositories/IServiceRepository";
import Services from "@/models/service.model";
import { IService } from "@/types/service";
import { buildServiceFilter } from "@/utils/admin/buildServiceFilter";
import { injectable } from "inversify";
import { FilterQuery } from "mongoose";

@injectable()
export class ServiceRepository extends BaseRepository<IService> implements IServiceRepository {
  constructor() {
    super(Services);
  }

  countDocuments(filter: FilterQuery<IService>): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async getAllServices(
    skip: number,
    limit: number,
    search: string,
    status: string,
    parentId: string | null
  ): Promise<IService[]> {
    const filter = buildServiceFilter(search, status, parentId);
    return this.model.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec();
  }
}
