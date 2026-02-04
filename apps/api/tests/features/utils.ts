import type { PayloadAccessToken } from '@/types/payload.type';
import { sign } from 'hono/jwt';

/**
 *
 * @param JWT_SECRET
 * @param admin default false
 * @param sub default 1
 * @returns promised string token
 */
export const generateToken = (
  JWT_SECRET: string,
  admin: boolean = false,
  sub?: number,
) => {
  const payload: PayloadAccessToken = {
    sub: sub ?? 1,
    role: admin ? 'admin' : 'user',
    username: 'admin',
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  return sign(payload, JWT_SECRET);
};
