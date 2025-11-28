import { JwtPayloadWithUser } from "./jwt";
import multer from "multer";

interface IToken extends JwtPayloadWithUser {
  workerId?: string;
}
declare module "express-serve-static-core" {
  interface Request {
    user?: IToken;
  }
}

declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer?: Buffer;
      }
    }
  }
}
