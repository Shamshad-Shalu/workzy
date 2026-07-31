export interface ReviewListQueryInput {
  limit: number;
  cursor?: {
    createdAt: Date;
    _id: string;
    rating?: number;
  };
  rating?: number;
  sortBy?: "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
  status: "all" | "hidden" | "visible";
}

export interface ReviewListQuery extends ReviewListQueryInput {
  search?: string;
  serviceId?: string;
  categoryId?: string;
  userId?: string;
  workerId?: string;
  minRating?: number;
  maxRating?: number;
  fromDate?: Date;
  toDate?: Date;
}
