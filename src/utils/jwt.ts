import jwt, { SignOptions } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

interface JWTData {
  id: number;
  email: string;
  name: string;
}

export const generateToken = (data: JWTData, expiresIn: string): string => {
  return jwt.sign(data, JWT_SECRET, { expiresIn: expiresIn } as SignOptions);
};

export const verifyToken = (token:string): JWTData | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTData | null;
  } catch (err) {
    return null;
  }
};

export const decodeToken = (token:string): JWTData | null => {
  return jwt.decode(token) as JWTData | null;
};
