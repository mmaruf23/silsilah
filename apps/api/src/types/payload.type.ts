import type { JWTPayload } from 'hono/utils/jwt/types';

export interface PayloadrRefreshToken extends JWTPayload {
  jti: string;
  sub: number;
}
