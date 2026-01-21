import type { ApiResponse } from '@/types/response.type';
import type { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { jwt } from 'hono/jwt';
import { validator } from 'hono/validator';
import z from 'zod';

const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6).nullable(),
});

export const authRequestValidator = validator('json', (value) => {
  const parsed = registerSchema.safeParse(value);
  if (!parsed.success) {
    const errPrty = z.treeifyError(parsed.error);
    throw new HTTPException(400, {
      message: 'BAD REQUEST',
      cause: errPrty.properties,
    });
  }

  return parsed.data;
});

export const loginValidator = jwt({ secret: 'iniprivatekey' });
/**
 * hanya bisa bekerja setelah loginValidator
 */
export const adminValidator: MiddlewareHandler = async (c, next) => {
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
      401
    );
  }

  await next();
};
