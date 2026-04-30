export type PaginatedResult<T> = {
  data: T[];
  total: number;
};

export type CursorPaginatedResult<T, C = string | null> = {
  data: T[];
  nextCursor: C;
};
