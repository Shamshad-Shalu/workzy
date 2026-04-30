import { Document } from "mongoose";

import { Role } from "@/constants";

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
  role: Role;
  profileImage?: string;
  password: string;
  profile?: {
    address: IAdress;
    location: ILocation;
  };
  isBlocked: boolean;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}
