import { env } from 'cloudflare:workers';
import { jwt } from 'hono/jwt';
import type { ApiResponse } from '@/types/response.type';
import type { MiddlewareHandler } from 'hono';

export const jwtMiddleware = jwt({ secret: env.JWT_SECRET });
export const refreshTokenMiddleware = jwt({
  secret: env.JWT_SECRET,
  cookie: 'refresh_token',
});

/**
 * hanya bisa bekerja setelah loginValidator
 */
export const adminMiddleware: MiddlewareHandler = async (c, next) => {
  const payload = c.get('jwtPayload') as
    | {
        role: 'user' | 'admin';
      }
    | undefined;
  if (!payload || payload.role !== 'admin') {
    return c.json<ApiResponse>(
      {
        success: false,
        code: 401,
        message: 'Akun bukan atmin :)',
      },
      401,
    );
  }

  await next();
};
