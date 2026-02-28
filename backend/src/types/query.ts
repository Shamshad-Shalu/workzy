export type PaginationParams = {
  page: number;
  limit: number;
};

export type SearchParams = {
  search: string;
};

export type StatusParams = {
  status: string;
};
// export type Status =  "all" | "active" | "inactive";

export type ListBaseParams = PaginationParams & SearchParams & StatusParams;
