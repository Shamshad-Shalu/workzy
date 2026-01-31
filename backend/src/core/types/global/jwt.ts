import { JwtPayload } from "jsonwebtoken";

import { Role } from "@/constants";

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
