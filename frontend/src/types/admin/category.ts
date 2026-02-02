import type { Category } from '../category';

export interface CategoryResponse {
  categories: Category[];
  total: number;
}

export type CategoryFilters = {
  pageIndex: number;
  pageSize: number;
  search: string;
  status: string;
  parentId: string | null;
};

export interface CategoryAncestor {
  id: string;
  name: string;
  level: number;
  parentId: string | null;
}
