import { Hono } from 'hono';
import authService from './auth.service';
import type { ApiResponse } from '@/types/response.type';
import z from 'zod';
import { jsonValidator } from '../global/validator';
import { setCookie } from 'hono/cookie';

const authRequestSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6).nullable(),
});

export const authRoutes = new Hono()
  .post('/register', jsonValidator(authRequestSchema), async (c) => {
    const req = c.req.valid('json');
    const data = await authService.register(req);

    return c.json<ApiResponse<typeof data>>({
      success: true,
      code: 200,
      data,
    });
  })
  // todo : implement refresh token
  .post('/login', jsonValidator(authRequestSchema), async (c) => {
    const req = c.req.valid('json');
    const user = await authService.login(req);

    const data = await authService.issueAccessToken(user);
    const { refreshToken, maxAge } = await authService.issueRefreshToken(
      user.id,
    );

    setCookie(c, 'refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge,
    });

    return c.json<ApiResponse<typeof data>>(
      { success: true, code: 200, data },
      200,
    );
  });
