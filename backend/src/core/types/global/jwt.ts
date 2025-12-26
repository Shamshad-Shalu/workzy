import { Role } from "@/constants";
import { JwtPayload } from "jsonwebtoken";

export interface AccessTokenPayload extends JwtPayload {
  _id: string;
  role: Role;
  workerId?: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  user: {
    _id: string;
    role: Role;
  };
}
