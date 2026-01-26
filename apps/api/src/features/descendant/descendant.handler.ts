import type { ApiResponse } from '@/types/response.type';
import { Hono } from 'hono';
import { adminMiddleware, jwtMiddleware } from '../auth/auth.middleware';
import { newDescendantValidator } from './descendant.middleware';
import personService from '../person/person.service';
import mariageService from '../mariage/mariage.service';
import descendantService from './descendant.service';

export const descendantRoute = new Hono()
  .use(jwtMiddleware, adminMiddleware)
  // ADD DESCENDANT
  .post('/', newDescendantValidator, async (c) => {
    const { personId, mariageId } = c.req.valid('json');
    await Promise.all([
      personService.assertExist(personId),
      mariageService.assertExist(mariageId),
    ]);

    const data = await descendantService.addDescendant(personId, mariageId);

    return c.json<ApiResponse<typeof data>>(
      {
        success: true,
        code: 201,
        data,
      },
      201,
    );
  });
