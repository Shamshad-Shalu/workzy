export interface Cursor {
  createdAt: Date;
  _id: string;
}

export type SortType = "price_asc" | "price_desc" | "newest" | "oldest";
