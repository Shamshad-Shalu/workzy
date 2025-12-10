import { HTTPSTATUS } from "@/constants";
import CustomError from "./customError";

export async function getEntityOrThrow<T>(
  repo: { findById(id: string): Promise<T | null> },
  id: string,
  errorMessage?: string
): Promise<T> {
  const entity = await repo.findById(id);
  if (!entity) {
    throw new CustomError(errorMessage || "Item Not Found", HTTPSTATUS.NOT_FOUND);
  }
  return entity;
}
