import { Hono } from 'hono';
import {
  adminValidator,
  loginValidator,
} from '@/features/auth/auth.middleware';
import { createPersonSchema, searchQueryShema } from './person.request.schema';
import personService from './person.service';
import type { ApiResponse } from '@/types/response.type';
import { zValidator } from '@hono/zod-validator';
import {
  jsonValidator,
  limitOffsetSchema,
  paramValidator,
  queryValidator,
} from '../global/validator';
import z from 'zod';

const schema = searchQueryShema.extend(limitOffsetSchema.shape);

export const personRoute = new Hono()
  // GET BY ID
  .get(
    '/:id',
    loginValidator,
    paramValidator(z.object({ id: z.coerce.number() })),
    async (c) => {
      const { id } = c.req.valid('param');
      const data = await personService.getPersonByID(Number(id));
      return c.json<ApiResponse<typeof data>>({
        success: true,
        code: 200,
        data,
      });
    }
  )
  // GET ALL + FILTER
  // todo :  bikin implement pagination -sama kaya users service-
  .get('/', queryValidator(schema), async (c) => {
    const query = c.req.valid('query') as z.Infer<typeof schema>;

    const { data, total } = await personService.getPersons(query);
    // todo : nanti bikin util metaBuilder

    return c.json<ApiResponse<typeof data>>({
      success: true,
      code: 200,
      data,
      meta: { total },
    });
  })
  .post(
    '/',
    loginValidator,
    adminValidator,
    jsonValidator(createPersonSchema),
    async (c) => {
      const person = c.req.valid('json') as z.Infer<typeof createPersonSchema>;

      const data = await personService.addPerson(person);
      return c.json<ApiResponse>({
        success: true,
        code: 200,
        data,
      });
    }
  );
