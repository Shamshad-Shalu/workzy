import { JwtPayload } from "jsonwebtoken";

import { Role } from "@/constants";

export interface AccessTokenPayload extends JwtPayload {
  id: string;
  role: Role;
  workerId?: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  user: {
    id: string;
    role: Role;
  };
}
