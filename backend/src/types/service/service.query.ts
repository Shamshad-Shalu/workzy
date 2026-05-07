import { ServiceType } from "@/constants";

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
export interface PublicServiceListQuery {
  type: ServiceType | "all";
  cursor?: Cursor | null;
  limit: number;
  search?: string;
}
