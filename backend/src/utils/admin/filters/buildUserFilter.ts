export interface UserFilter {
  $or?: Array<{ name: RegExp } | { email: RegExp }>;
  isBlocked?: boolean;
  role?: string;
}

export function buildUserFilter(search?: string, status?: string, role?: string): UserFilter {
  const filter: UserFilter = {};

  if (search && search.trim() !== "") {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }

  if (status === "active") filter.isBlocked = false;
  if (status === "blocked") filter.isBlocked = true;

  if (role && role !== "all") {
    filter.role = role;
  }

  return filter;
}
