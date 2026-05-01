interface Cursor {
  createdAt: Date;
  _id: string;
}

export interface ServiceListQuery {
  status: "all" | "blocked" | "active";
  cursor?: Cursor | null;
  limit: number;
  categoryId?: string | null;
  search?: string;
}
