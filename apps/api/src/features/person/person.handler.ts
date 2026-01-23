import { Hono } from 'hono';
import {
  adminMiddleware,
  jwtMiddleware,
} from '@/features/auth/auth.middleware';
import { createPersonSchema, searchQueryShema } from './person.request.schema';
import personService from './person.service';
import type { ApiResponse } from '@/types/response.type';
import {
  limitOffsetSchema,
  jsonValidator,
  paramValidator,
  queryValidator,
} from '@/features/global/validator';
import z from 'zod';
import type { PersonInsert } from '@/db/schema/person';

const schema = searchQueryShema.extend(limitOffsetSchema.shape);

export const personRoute = new Hono()
  // GET BY ID
  .get(
    '/:id',
    jwtMiddleware,
    paramValidator(z.object({ id: z.coerce.number() })),
    async (c) => {
      const { id } = c.req.valid('param');
      const data = await personService.getPersonByID(id);
      return c.json<ApiResponse<typeof data>>({
        success: true,
        code: 200,
        data,
      });
    },
  )
  // GET ALL + FILTER
  // todo :  bikin implement pagination -sama kaya users service-
  .get('/', queryValidator(schema), async (c) => {
    const query = c.req.valid('query');

    const { data, total } = await personService.getPersons(query);
    // todo : nanti bikin util metaBuilder

    return c.json<ApiResponse<typeof data>>({
      success: true,
      code: 200,
      data,
      meta: { total },
    });
  })
  // ADD NEW PERSON
  .use(jwtMiddleware, adminMiddleware)
  .post('/', jsonValidator(createPersonSchema), async (c) => {
    const { birthDate, deathDate, ...req } = c.req.valid('json');
    const person: PersonInsert = req;
    if (birthDate) person.birthDate = new Date(birthDate);
    if (deathDate) person.deathDate = new Date(deathDate);
    const data = await personService.addPerson(person);
    return c.json<ApiResponse<typeof data>>(
      {
        success: true,
        code: 201,
        data,
      },
      201,
    );
  });
// .patch('/:id', );
