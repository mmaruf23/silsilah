import { Hono } from 'hono';
import authService from './auth.service';
import type { ApiResponse } from '@/types/response.type';
import z from 'zod';
import { jsonValidator } from '../global/validator';
import { setCookie } from 'hono/cookie';
import { refreshTokenMiddleware } from './auth.middleware';
import type { PayloadrRefreshToken } from '@/types/payload.type';
import userService from '../user/user.service';

const authRequestSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6).nullable(),
});

export const authRoutes = new Hono<{ Bindings: CloudflareBindings }>()
  .post('/register', jsonValidator(authRequestSchema), async (c) => {
    const req = c.req.valid('json');
    const data = await authService.register(req);

    return c.json<ApiResponse<typeof data>>({
      success: true,
      code: 200,
      data,
    });
  })
  .post('/login', jsonValidator(authRequestSchema), async (c) => {
    const req = c.req.valid('json');
    const user = await authService.login(req);

    const data = await authService.issueAccessToken(user);
    const { refreshToken } = await authService.issueRefreshToken(user.id);

    setCookie(c, 'refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: c.env.MAX_AGE_JWT_REFRESH,
    });

    return c.json<ApiResponse<typeof data>>(
      { success: true, code: 200, data },
      200,
    );
  })
  .post('/refresh', refreshTokenMiddleware, async (c) => {
    const payload = c.get('jwtPayload') as PayloadrRefreshToken;
    const refreshToken = await authService.rotateToken(payload); // 2 query ke token table
    const user = await userService.findUserByID(payload.sub); // 1 query ke user table
    const data = await authService.issueAccessToken(user);

    setCookie(c, 'refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: c.env.MAX_AGE_JWT_REFRESH,
    });

    return c.json<ApiResponse<typeof data>>(
      {
        code: 201,
        success: true,
        data: data,
      },
      201,
    );
  })
  .post('/logout', refreshTokenMiddleware, async (c) => {
    const payload = c.get('jwtPayload') as PayloadrRefreshToken;
    await authService.logout(payload);

    return c.json<ApiResponse>({
      success: true,
      code: 200,
    });
  });
