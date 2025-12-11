export interface ServiceRow {
  _id: string;
  name: string;
  description: string;
  level: number;
  iconUrl: string;
  imageUrl: string;
  isAvailable: boolean;
  platformFee: string;
  parentId?: null | string;
}

export interface ServiceResponse {
  services: ServiceRow[];
  total: number;
}
