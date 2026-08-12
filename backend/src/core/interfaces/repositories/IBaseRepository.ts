import { DeleteResult, FilterQuery, Types, UpdateQuery, UpdateWriteOpResult } from "mongoose";

import { RepositoryOptions } from "@/core/types/repository";

export interface IBaseRepository<T> {
  findAll(options?: RepositoryOptions): Promise<T[]>;
  create(data: Partial<T>, options?: RepositoryOptions): Promise<T>;
  update(
    id: Types.ObjectId | string,
    data: UpdateQuery<T>,
    options?: RepositoryOptions
  ): Promise<T | null>;
  delete(id: Types.ObjectId | string, options?: RepositoryOptions): Promise<T | null>;
  find(filter: FilterQuery<T>, options?: RepositoryOptions): Promise<T[]>;
  findOne(filter: FilterQuery<T>, options?: RepositoryOptions): Promise<T | null>;
  findById(id: Types.ObjectId | string, options?: RepositoryOptions): Promise<T | null>;
  findByIdAndUpdate(
    id: Types.ObjectId | string,
    update: UpdateQuery<T>,
    options?: RepositoryOptions
  ): Promise<T | null>;

  updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: RepositoryOptions
  ): Promise<UpdateWriteOpResult>;
  deleteOne(filter: FilterQuery<T>, options?: RepositoryOptions): Promise<DeleteResult>;
  deleteMany(filter: FilterQuery<T>, options?: RepositoryOptions): Promise<DeleteResult>;

  findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: RepositoryOptions
  ): Promise<T | null>;
  findOneAndDelete(filter: FilterQuery<T>, options?: RepositoryOptions): Promise<T | null>;

  countDocuments(filter: FilterQuery<T>, options?: RepositoryOptions): Promise<number>;
}
