import mongoose from "mongoose";

interface ServiceFilterParams {
  name?: { $regex: string; $options: string };
  isAvailable?: boolean;
  parentId?: string | null | mongoose.Types.ObjectId;
}

export function buildServiceFilter(
  search?: string,
  status?: string,
  parentId?: string | null
): ServiceFilterParams {
  const query: ServiceFilterParams = {};

  if (search && search.trim() !== "") {
    query.name = { $regex: search, $options: "i" };
  }

  if (status && status !== "all") {
    if (status === "active") query.isAvailable = true;
    else if (status === "blocked") query.isAvailable = false;
  }
  if (parentId) {
    query.parentId = new mongoose.Types.ObjectId(parentId);
  } else {
    query.parentId = null;
  }
  return query;
}
