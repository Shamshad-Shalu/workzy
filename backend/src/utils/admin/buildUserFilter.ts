export function buildUserFilter(search?: string, status?: string, role?: string) {
  const filter: any = {};

  if (search && search.trim() !== "") {
    const re = new RegExp(search.trim(), "i");
    filter.$or = [{ name: re }, { email: re }];
  }

  if (status && status !== "all") {
    if (status === "active") filter.isBlocked = false;
    else if (status === "blocked") filter.isBlocked = true;
  }

  if (role && role !== "all") {
    filter.role = role;
  }

  return filter;
}
