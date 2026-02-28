export interface PlanFilter {
  name?: { $regex: string; $options: "i" };
  isAvailable?: boolean;
}

export function buildPlanFilter(search?: string, status?: string): PlanFilter {
  const filter: PlanFilter = {};

  if (search && search.trim() !== "") {
    filter.name = { $regex: search, $options: "i" };
  }

  if (status === "active") filter.isAvailable = true;
  if (status === "inactive") filter.isAvailable = false;
  return filter;
}
