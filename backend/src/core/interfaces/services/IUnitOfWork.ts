import { RepositoryOptions } from "@/core/types/repository";

export interface IUnitOfWork {
  execute<T>(work: (options: RepositoryOptions) => Promise<T>): Promise<T>;
}
