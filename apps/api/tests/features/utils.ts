import type { PayloadAccessToken } from '@/types/payload.type';
import { sign } from 'hono/jwt';

/**
 *
 * @param JWT_SECRET
 * @param admin default false
 * @returns promised string token
 */
export const generateToken = (JWT_SECRET: string, admin: boolean = false) => {
  const payload: PayloadAccessToken = {
    sub: 1,
    role: 'admin',
    username: 'admin',
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  return sign(payload, JWT_SECRET);
};

// next : update type start_date sama end_date mariage jadi tipe integer-date. biar bisa dipake ngitung usia pernikahan.
