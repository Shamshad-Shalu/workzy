import {
  Document,
  Model,
  FilterQuery,
  UpdateQuery,
  DeleteResult,
  Types,
  UpdateWriteOpResult,
} from "mongoose";

import { RepositoryOptions } from "@/core/types/repository";

import { IBaseRepository } from "../interfaces/repositories/IBaseRepository";

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async findById(id: Types.ObjectId | string, options?: RepositoryOptions): Promise<T | null> {
    return this.model.findById(id, null, { session: options?.session });
  }

  async findByIdAndUpdate(
    id: Types.ObjectId | string,
    update: UpdateQuery<T>,
    options?: RepositoryOptions
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true, session: options?.session });
  }

  async findAll(options?: RepositoryOptions): Promise<T[]> {
    return this.model.find({}, null, { session: options?.session });
  }

  async create(data: Partial<T>, options?: RepositoryOptions): Promise<T> {
    const document = new this.model(data);
    return document.save({ session: options?.session });
  }

  async update(
    id: Types.ObjectId | string,
    data: UpdateQuery<T>,
    options?: RepositoryOptions
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true, session: options?.session });
  }

  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: RepositoryOptions
  ): Promise<UpdateWriteOpResult> {
    return this.model.updateOne(filter, update, { session: options?.session });
  }

  async delete(id: Types.ObjectId | string, options?: RepositoryOptions): Promise<T | null> {
    return this.model.findByIdAndDelete(id, { session: options?.session });
  }

  async deleteOne(filter: FilterQuery<T>, options?: RepositoryOptions): Promise<DeleteResult> {
    return this.model.deleteOne(filter, { session: options?.session });
  }

  async deleteMany(filter: FilterQuery<T>, options?: RepositoryOptions): Promise<DeleteResult> {
    return this.model.deleteMany(filter, { session: options?.session });
  }

  async find(filter: FilterQuery<T>, options?: RepositoryOptions): Promise<T[]> {
    return await this.model.find(filter, null, { session: options?.session });
  }

  async findOne(filter: FilterQuery<T>, options?: RepositoryOptions): Promise<T | null> {
    return this.model.findOne(filter, null, { session: options?.session });
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: RepositoryOptions
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true, session: options?.session });
  }

  async findOneAndDelete(filter: FilterQuery<T>, options?: RepositoryOptions): Promise<T | null> {
    return this.model.findOneAndDelete(filter, { session: options?.session });
  }

  countDocuments(filter: FilterQuery<T>, options?: RepositoryOptions): Promise<number> {
    return this.model.countDocuments(filter, { session: options?.session }).exec();
  }
}
