import { Hono } from 'hono';
import {
  adminMiddleware,
  jwtMiddleware,
} from '@/features/auth/auth.middleware';
import type { ApiResponse } from '@/types/response.type';
import userService from './user.service';
import { zValidator } from '@hono/zod-validator';
import { limitOffsetSchema } from '../global/validator';

export const userRoutes = new Hono()
  .get('/me', jwtMiddleware, async (c) => {
    const { sub } = c.get('jwtPayload') as { sub: string };

    const data = await userService.getUserProfile(sub);
    // todo: logout if not found. just in case

    return c.json<ApiResponse<typeof data>>({
      success: true,
      code: 200,
      data,
    });
  })
  /** todo :
   * [ ] bikin implement pagination,
   * [x] authorize hanya khusus admin
   *  */

  .get(
    '/',
    jwtMiddleware,
    adminMiddleware,
    zValidator('query', limitOffsetSchema), // todo : ganti jadi validator biasa aja, yang udah ada
    async (c) => {
      const { limit, offset } = c.req.valid('query');
      const data = await userService.getAllUser(limit, offset);
      return c.json<ApiResponse<typeof data>>({
        success: true,
        code: 200,
        data,
      });
    },
  );
