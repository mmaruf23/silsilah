import { Hono } from 'hono';
import { authRequestValidator } from './auth.middleware';
import authService from './auth.service';
import type { SuccessResponse } from '@/types/response.type';

export const authRoutes = new Hono()
  .post('/register', authRequestValidator, async (c) => {
    const req = c.req.valid('json');
    const data = await authService.register(req);

    return c.json<SuccessResponse<typeof data>>({
      success: true,
      code: 200,
      data,
    });
  })
  // todo : implement refresh token
  .post('/login', authRequestValidator, async (c) => {
    const req = c.req.valid('json');
    const data = await authService.login(req);
    return c.json<SuccessResponse<typeof data>>(
      { success: true, code: 200, data },
      200
    );
  });
