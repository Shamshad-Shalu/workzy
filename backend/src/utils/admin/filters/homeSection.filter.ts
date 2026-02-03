import { FilterQuery } from "mongoose";

import { ListType } from "@/core/interfaces/services/IHomeSectionService";
import { IHomeSection } from "@/models/homeSection.model";

export function buildHomeSectionFilter(
  search: string,
  status: string,
  type: ListType
): FilterQuery<IHomeSection> {
  const filter: FilterQuery<IHomeSection> = {};
  if (search && search.trim() !== "") {
    filter.name = { $regex: search.trim(), $options: "i" };
  }
  if (status === "active") filter.isActive = true;
  if (status === "inactive") filter.isActive = false;

  if (type !== "all") filter.type = type;

  return filter;
}
