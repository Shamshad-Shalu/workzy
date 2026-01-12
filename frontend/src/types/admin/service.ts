export interface Service {
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

export interface ServiceResponse {
  services: Service[];
  total: number;
}
