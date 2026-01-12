import type { AccessTokenPayload } from "./jwt";

interface IToken extends AccessTokenPayload {
  workerId?: string;
}
declare module "express-serve-static-core" {
  interface Request {
    user?: IToken;
  }
}
