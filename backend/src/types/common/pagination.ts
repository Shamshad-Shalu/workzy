export type PaginatedResult<T> = {
  data: T[];
  total: number;
};

export type CursorPaginatedResult<T> = {
  data: T[];
  nextCursor: string | null;
  prevCursor?: string | null;
};
