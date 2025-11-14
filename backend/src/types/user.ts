import { Document } from "mongoose";

export type Role = "user" | "admin" | "worker";

export interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IUser extends Document<string> {
  name: string;
  email: string;
  phone?: string;
  age?: number;
  role: Role;
  profileImage?: string;
  password: string;
  isPremium: boolean;
  profile?: {
    bio: string;
    address: string;
    location: ILocation;
  };
  isBlocked: boolean;
  googleId?: string;
}
