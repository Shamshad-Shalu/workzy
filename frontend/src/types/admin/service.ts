export interface ServiceRow {
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

export interface ServiceDTO {
  _id?: string;
  name: string;
  description?: string;
  iconUrl: string | File | null;
  imageUrl: string | File | null;
  parentId?: string | null;
  level?: number;
  platformFee: number;
  isAvailable?: boolean;
}

export interface ServiceResponse {
  services: ServiceRow[];
  total: number;
}
