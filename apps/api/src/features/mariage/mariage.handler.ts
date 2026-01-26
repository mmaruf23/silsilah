import type { ApiResponse } from '@/types/response.type';
import { Hono } from 'hono';
import {
  editMariageValidator,
  newMariageValidator,
} from './mariage.middleware';
import mariageService from './mariage.service';
import { adminMiddleware, jwtMiddleware } from '../auth/auth.middleware';
import { X } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js';
import { IDParamValidator } from '../global/validator';

export const mariageRoute = new Hono()
  .use(jwtMiddleware, adminMiddleware)
  // NEW MARIAGE
  .post('/', newMariageValidator, async (c) => {
    const mariage = c.req.valid('json');
    const data = await mariageService.addMariage(mariage);
    return c.json<ApiResponse<typeof data>>(
      {
        success: true,
        code: 201,
        data,
      },
      201,
    );
  })
  // UPDATE MARIAGE
  .put('/:id', IDParamValidator, editMariageValidator, async (c) => {
    const { id } = c.req.valid('param');
    const mariage = c.req.valid('json');
    const data = await mariageService.editMariage(id, mariage);
    return c.json<ApiResponse<typeof data>>(
      {
        success: true,
        code: 200,
        data,
      },
      200,
    );
  });
