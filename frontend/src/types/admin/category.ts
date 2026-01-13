export interface Category {
  _id: string;
  name: string;
  description?: string;
  level: number;
  iconUrl: string;
  imageUrl: string;
  isAvailable: boolean;
  platformFee: number;
  parentId?: null | string;
}

export interface CategoryResponse {
  categories: Category[];
  total: number;
}
