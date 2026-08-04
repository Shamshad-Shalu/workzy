import { injectable } from "inversify";
import mongoose from "mongoose";

import { IUnitOfWork } from "@/core/interfaces/services/IUnitOfWork";
import { RepositoryOptions } from "@/core/types/repository";

@injectable()
export class UnitOfWork implements IUnitOfWork {
  async execute<T>(work: (options: RepositoryOptions) => Promise<T>): Promise<T> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await work({ session });
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }
}
