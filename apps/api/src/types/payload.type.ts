import type { JWTPayload } from 'hono/utils/jwt/types';

export interface PayloadrRefreshToken extends JWTPayload {
  jti: string;
  sub: number;
}

export interface PayloadAccessToken extends JWTPayload {
  sub: number;
  role: 'admin' | 'user';
  username: string;
}
