import { Request } from 'express';

export interface JwtPayloadExtended {
  id: number;
  email: string;
  role: 'admin' | 'curator';
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user: JwtPayloadExtended;
}
