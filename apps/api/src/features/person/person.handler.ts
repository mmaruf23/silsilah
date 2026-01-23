import { Hono } from 'hono';
import {
  adminValidator,
  loginValidator,
} from '@/features/auth/auth.middleware';
import { createPersonSchema, searchQueryShema } from './person.request.schema';
import personService from './person.service';
import type { ApiResponse } from '@/types/response.type';
import {
  jsonValidator,
  limitOffsetSchema,
  paramValidator,
  queryValidator,
} from '@/features/global/validator';
import z, { date } from 'zod';
import type { PersonInsert } from '@/db/schema/person';

const schema = searchQueryShema.extend(limitOffsetSchema.shape);

export const personRoute = new Hono()
  // GET BY ID
  .get(
    '/:id',
    loginValidator,
    paramValidator(z.object({ id: z.coerce.number() })),
    async (c) => {
      const { id } = c.req.valid('param') as { id: number };
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
  // ADD NEW PERSON
  .post('/', loginValidator, jsonValidator(createPersonSchema), async (c) => {
    const { birthDate, deathDate, ...req } = c.req.valid('json');
    const person: PersonInsert = {
      ...req,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      deathDate: deathDate ? new Date(deathDate) : undefined,
    };
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
