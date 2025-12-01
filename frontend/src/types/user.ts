import type { Role } from '@/constants';

export interface Address {
  house?: string;
  place?: string;
  city?: string;
  state?: string;
  pincode?: string;
}
export interface Location {
  type: 'Point';
  coordinates: [number, number];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  isPremium: boolean;
  profileImage?: string;
  profile?: {
    address?: Address;
    location?: Location;
  };

  isBlocked: boolean;
}
