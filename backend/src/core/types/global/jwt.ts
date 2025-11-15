import { Role } from "@/constants";
import { JwtPayload } from "jsonwebtoken";

export interface JwtPayloadWithUser extends JwtPayload {
  _id: string;
  name: string;
  email: string;
  role: Role;
}
