export function buildServiceFilter(search?: string, status?: string, parentId?: string | null) {
  const filter: any = {};

  if (search && search.trim() !== "") {
    const re = new RegExp(search.trim(), "i");
    filter.$or = [{ name: re }];
  }

  if (status && status !== "all") {
    if (status === "active") filter.isAvailable = true;
    else if (status === "blocked") filter.isAvailable = false;
  }

  filter.parentId = parentId;
  return filter;
}
