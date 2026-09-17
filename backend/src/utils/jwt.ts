import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface JwtPayload {
  userId: string;
  role: 'student' | 'admin';
  email?: string;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as any,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
};
