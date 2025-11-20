import type { Role } from '@/constants';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  age?: number;
  isPremium: boolean;
  profileImage?: string;

  profile?: {
    bio: string;
    address: string;
    location: {
      type: 'Point';
      coordinates: [number, number];
    };
  };

  isBlocked: boolean;
}
