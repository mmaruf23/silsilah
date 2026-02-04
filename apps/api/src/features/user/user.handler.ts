import { Hono } from 'hono';
import {
  adminMiddleware,
  jwtMiddleware,
} from '@/features/auth/auth.middleware';
import type { ApiResponse } from '@/types/response.type';
import userService from './user.service';
import { searchUserSchema } from './user.middleware';
import { metaBuilder } from '@/utils/builder';
import { queryValidator } from '../global/validator';
import type { PayloadAccessToken } from '@/types/payload.type';

export const userRoutes = new Hono()
  .get('/me', jwtMiddleware, async (c) => {
    const { username } = c.get('jwtPayload') as PayloadAccessToken;

    const data = await userService.getUserProfile(username);

    return c.json<ApiResponse<typeof data>>({
      success: true,
      code: 200,
      data,
    });
  })

  .get(
    '/',
    jwtMiddleware,
    adminMiddleware,
    queryValidator(searchUserSchema),
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
