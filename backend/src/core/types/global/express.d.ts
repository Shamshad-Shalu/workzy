import { JwtPayloadWithUser } from "./jwt";

interface IToken extends JwtPayloadWithUser {
  workerId?: string;
}
declare module "express-serve-static-core" {
  interface Request {
    user?: IToken;
  }
}
