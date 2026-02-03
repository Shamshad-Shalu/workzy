import mongoose from "mongoose";

export interface ServiceFilter {
  name?: { $regex: string; $options: "i" };
  isAvailable?: boolean;
  parentId?: mongoose.Types.ObjectId | null;
}

export function buildCategoryFilter(
  search?: string,
  status?: string,
  parentId?: string | null
): ServiceFilter {
  const filter: ServiceFilter = {};

  if (search && search.trim() !== "") {
    filter.name = { $regex: search, $options: "i" };
  }

  if (status === "active") filter.isAvailable = true;
  if (status === "blocked") filter.isAvailable = false;

  if (parentId === null) {
    filter.parentId = null;
  } else if (parentId) {
    filter.parentId = new mongoose.Types.ObjectId(parentId);
  }
  return filter;
}
