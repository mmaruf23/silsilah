import { env } from 'cloudflare:workers';
import { jwt } from 'hono/jwt';
import type { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { PayloadAccessToken } from '@/types/payload.type';

export const jwtMiddleware = jwt({ secret: env.JWT_SECRET });
export const refreshTokenMiddleware = jwt({
  secret: env.JWT_REFRESH_SECRET,
  cookie: 'refresh_token',
});

/**
 * hanya bisa bekerja setelah jwtMiddleware
 */
export const adminMiddleware: MiddlewareHandler = async (c, next) => {
  const payload = c.get('jwtPayload') as PayloadAccessToken | undefined;
  if (!payload || payload.role !== 'admin')
    throw new HTTPException(401, {
      message: 'Akun bukan atmin :)',
    });

  await next();
};

/**
 * hanya bisa bekerja setelah loginValidator
 */
export const userProfileMiddleware: MiddlewareHandler = async (c, next) => {
  const id = c.req.param('id');
  if (!id) throw new HTTPException(400, { message: 'param id is required' });
  const payload = c.get('jwtPayload') as PayloadAccessToken | undefined;
  if (!payload || !payload.sub || Number(id) !== payload.sub)
    throw new HTTPException(401, {
      message: 'Not your bussines :)',
    });

  await next();
};
