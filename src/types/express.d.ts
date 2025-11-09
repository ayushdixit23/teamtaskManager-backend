import { JWTData } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: JWTData;
    }
  }
}

export {};

