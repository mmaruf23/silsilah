import { Hono } from 'hono';
import {
  adminMiddleware,
  jwtMiddleware,
} from '@/features/auth/auth.middleware';
import {
  newPersonSchema,
  searchPersonShema,
  updatePersonSchema,
} from './person.middleware';
import personService from './person.service';
import type { ApiResponse } from '@/types/response.type';
import {
  IDParamValidator,
  jsonValidator,
  queryValidator,
} from '@/features/global/validator';
import z from 'zod';
import type { PersonInsert, PersonUpdate } from '@/db/schema/person';
import descendantService from '../descendant/descendant.service';
import { metaBuilder } from '@/utils/builder';

export const personRoute = new Hono()
  // GET BY ID
  .get('/:id', jwtMiddleware, IDParamValidator, async (c) => {
    const { id } = c.req.valid('param');
    const data = await personService.getPersonByID(id);
    return c.json<ApiResponse<typeof data>>(
      {
        success: true,
        code: 200,
        data,
      },
      200,
    );
  })
  // GET ALL + FILTER
  // todo :  bikin implement pagination -sama kaya users service-
  .get('/', queryValidator(searchPersonShema), async (c) => {
    const query = c.req.valid('query');

    const { data, total } = await personService.getPersons(query);
    const meta = metaBuilder(total, query.page, query.per_page);

    return c.json<ApiResponse<typeof data>>(
      { success: true, code: 200, data, meta },
      200,
    );
  })
  // ADD NEW PERSON
  .use(jwtMiddleware, adminMiddleware)
  .post('/', jsonValidator(newPersonSchema), async (c) => {
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
  })
  // UPDATE PERSON
  .put(
    '/:id',
    IDParamValidator,
    jsonValidator(updatePersonSchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const { birthDate, deathDate, ...req } = c.req.valid('json');
      const person: PersonUpdate = req;
      if (birthDate) person.birthDate = new Date(birthDate);
      if (deathDate) person.deathDate = new Date(deathDate);

      const data = await personService.editPerson(id, person);
      return c.json<ApiResponse<typeof data>>(
        {
          success: true,
          code: 200,
          data,
        },
        200,
      );
    },
  )
  // GET PARENTS
  .get('/:id/parents', IDParamValidator, async (c) => {
    const { id } = c.req.valid('param');
    const data = await descendantService.getParents(id);
    return c.json<ApiResponse<typeof data>>(
      {
        success: true,
        code: 200,
        data,
      },
      200,
    );
  })
  // GET CHILDREN
  .get('/:id/children', IDParamValidator, async (c) => {
    const { id } = c.req.valid('param');
    console.log(id);
    const data = await descendantService.getChildrens(id);
    return c.json<ApiResponse<typeof data>>(
      {
        success: true,
        code: 200,
        data,
      },
      200,
    );
  });
// todo : delete person feature.
// next : update person juga bisa oleh yang punya akun, gak harus admin doang. : mungkin bisa tambah validator baru buat ganti admin validator di bagian route nya
