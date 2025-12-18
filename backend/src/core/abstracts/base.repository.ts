import {
  Document,
  Model,
  FilterQuery,
  UpdateQuery,
  DeleteResult,
  Types,
  UpdateWriteOpResult,
} from "mongoose";
import { IBaseRepository } from "../interfaces/repositories/IBaseRepository";

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected model: Model<T>) {}

  async findById(id: Types.ObjectId | string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findByIdAndUpdate(id: Types.ObjectId | string, update: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, { upsert: true, new: true });
  }

  async findAll(): Promise<T[]> {
    return this.model.find();
  }

  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return document.save();
  }

  async update(id: Types.ObjectId | string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<UpdateWriteOpResult> {
    return this.model.updateOne(filter, update);
  }

  async delete(id: Types.ObjectId | string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }

  async deleteOne(filter: FilterQuery<T>): Promise<DeleteResult> {
    return this.model.deleteOne(filter);
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    return await this.model.find(filter);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T> {
    return this.model.findOneAndUpdate(filter, update, { upsert: true, new: true });
  }

  async findOneAndDelete(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter);
  }

  async softDelete(id: Types.ObjectId | string): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async restore(id: Types.ObjectId | string): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, { isActive: true }, { new: true });
  }
  countDocuments(filter: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
  async findWithPopulate(
    filter: FilterQuery<T>,
    populate: string,
    select: string,
    skip: number,
    limit: number
  ): Promise<T[]> {
    return this.model
      .find(filter)
      .populate(populate, select)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }
}
