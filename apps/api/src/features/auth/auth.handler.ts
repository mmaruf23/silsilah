import { Hono } from 'hono';
import authService from './auth.service';
import type { ApiResponse } from '@/types/response.type';
import z from 'zod';
import { jsonValidator } from '../global/validator';

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
    const data = await authService.login(req);
    return c.json<ApiResponse<typeof data>>(
      { success: true, code: 200, data },
      200,
    );
  });
