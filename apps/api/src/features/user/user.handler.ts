import { Hono } from 'hono';
import {
  adminMiddleware,
  jwtMiddleware,
} from '@/features/auth/auth.middleware';
import type { ApiResponse } from '@/types/response.type';
import userService from './user.service';
import { zValidator } from '@hono/zod-validator';
import { limitOffsetSchema } from '../global/validator';
import { searchUserSchema } from './user.middleware';
import { metaBuilder } from '@/utils/builder';

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
    zValidator('query', searchUserSchema), // todo : ganti jadi validator biasa aja, yang udah ada
    async (c) => {
      const query = c.req.valid('query');
      const { data, total } = await userService.getAllUser(query);
      const meta = metaBuilder(total, query.page, query.per_page);
      return c.json<ApiResponse<typeof data>>(
        { success: true, code: 200, data, meta },
        200,
      );
    },
  );
