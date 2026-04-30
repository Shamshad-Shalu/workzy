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

type WorkerMeta = {
  id: string;
  displayName: string;
  profileImage?: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  profileImage?: string;
  profile?: {
    address: Address;
    location: Location;
  };
  isBlocked: boolean;
  worker?: WorkerMeta;
}

export type UpdateUserPayload = Omit<Partial<User>, 'worker'> & {
  worker?: Partial<WorkerMeta>;
};

export interface VerifyOtpPayload {
  type: 'email' | 'phone';
  contact: string;
  otp: string;
}
export interface ResendOtpPayload {
  type: 'email' | 'phone';
  value: string;
}
