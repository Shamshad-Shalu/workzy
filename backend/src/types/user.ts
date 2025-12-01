import { Role } from "@/constants";
import { Document } from "mongoose";

export interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IAdress {
  house?: string;
  place?: string;
  city?: string;
  state?: string;
  pincode?: string;
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
    address?: IAdress;
    location: ILocation;
  };
  isBlocked: boolean;
  googleId?: string;
}
