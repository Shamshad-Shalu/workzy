import mongoose from "mongoose";

export interface ServiceFilter {
  name?: { $regex: string; $options: "i" };
  isAvailable?: boolean;
  parentId?: mongoose.Types.ObjectId | null;
}

export function buildServiceFilter(
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

  filter.parentId = parentId ? new mongoose.Types.ObjectId(parentId) : null;

  return filter;
}
