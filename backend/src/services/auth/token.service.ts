import crypto from "crypto";

import { injectable } from "inversify";

import redisClient from "@/config/redisClient";
import { ITokenService } from "@/core/interfaces/services/ITokenService";

@injectable()
export class TokenService implements ITokenService {
  generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  async validateToken(email: string, token: string): Promise<boolean> {
    const storedToken = await redisClient.get(`forgotPassword:${email}`);
    return storedToken === token;
  }
}
