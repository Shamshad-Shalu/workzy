export interface PlanFilter {
  name?: { $regex: string; $options: "i" };
  isActive?: boolean;
}

export function buildPlanFilter(search?: string, status?: string): PlanFilter {
  const filter: PlanFilter = {};

  if (search && search.trim() !== "") {
    filter.name = { $regex: search, $options: "i" };
  }

  if (status === "active") filter.isActive = true;
  if (status === "inactive") filter.isActive = false;
  return filter;
}
