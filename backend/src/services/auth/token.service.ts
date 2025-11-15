import { injectable } from "inversify";
import { ITokenService } from "@/core/interfaces/services/ITokenService";
import crypto from "crypto";
import redisClient from "@/config/redisClient";

@injectable()
export class TokenService implements ITokenService {
  generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  async validateToken(email: string, token: string): Promise<boolean> {
    try {
      const storedToken = await redisClient.get(`forgotPassword:${email}`);
      return storedToken === token;
    } catch (error) {
      throw error;
    }
  }
}
