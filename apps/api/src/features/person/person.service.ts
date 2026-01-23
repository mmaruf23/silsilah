import { db } from '@/db';
import { persons, type PersonInsert } from '@/db/schema/person';
import { and, count, eq, like } from 'drizzle-orm';
import { newNotFoundError } from '../global/global.exception';
import { users } from '@/db/schema/user';
import {
  newInputPersonError,
  newPersonAlreadyExists,
} from './person.exception';

type PersonFilter = {
  limit?: number;
  offset?: number;
  name?: string;
  address?: string;
};

const getPersonByID = async (id: number) => {
  const person = await db.query.persons.findFirst({
    where: eq(persons.id, id),
  });

  if (!person) throw newNotFoundError('person not found');
  return person;
};

const getPersons = async (query: PersonFilter) => {
  const data = await db.query.persons.findMany({
    where: ({ name, address }, { and, like, eq }) =>
      and(
        query.name ? like(name, `%${query.name}%`) : undefined,
        query.address ? eq(address, query.address) : undefined,
      ),
    limit: query.limit,
    offset: query.offset,
  });

  const total = await db.$count(persons);

  return { data, total };
};

const addPerson = async (_person: PersonInsert) => {
  const result = await db
    .insert(persons)
    .values(_person)
    .onConflictDoNothing()
    .catch((err) => {
      console.error(err);
      throw newInputPersonError();
    });

  if (!result.meta.last_row_id) throw newPersonAlreadyExists();

  return { id: result.meta.last_row_id };
};

export default { getPersonByID, getPersons, addPerson };
