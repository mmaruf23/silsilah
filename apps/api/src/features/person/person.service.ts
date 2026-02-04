import { db } from '@/db';
import {
  persons,
  type PersonInsert,
  type PersonUpdate,
} from '@/db/schema/person';
import { and, eq, like } from 'drizzle-orm';
import { newNotFoundError } from '../global/exception';
import {
  newInputPersonError,
  newInvalidRole,
  newPersonAlreadyExists,
} from './person.exception';
import type { PersonFilter } from './person.middleware';

const assertExist = async (id: number, as?: 'male' | 'female') => {
  const exist = await db.query.persons.findFirst({
    where: eq(persons.id, id),
    columns: { id: true, gender: true },
  });

  if (!exist) throw newNotFoundError(`person with id ${id} not found`);
  if (as && as !== exist.gender) throw newInvalidRole();
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
    columns: { createdAt: false, updatedAt: false },
    where: ({ name, address }, { and, like, eq }) =>
      and(
        query.name ? like(name, `%${query.name}%`) : undefined,
        query.address ? eq(address, query.address) : undefined,
      ),
    limit: query.per_page || 10,
    offset: (query.page || 1 - 1) * (query.per_page || 10),
  });

  const total = await db.$count(
    persons,
    and(
      query.name ? like(persons.name, `%${query.name}%`) : undefined,
      query.address ? eq(persons.address, query.address) : undefined,
    ),
  );

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

const editPerson = async (id: number, _person: PersonUpdate) => {
  const result = await db
    .update(persons)
    .set({ ..._person, updatedAt: new Date() })
    .where(eq(persons.id, id))
    .returning();

  if (result.length === 0)
    throw newNotFoundError('update failed, person not found');

  return result[0];
};

const deletePerson = async (id: number) => {
  const result = await db.delete(persons).where(eq(persons.id, id));

  if (!result.meta.changes)
    throw newNotFoundError(`person with id ${id} not found or already deleted`);
};

export default {
  getPersonByID,
  getPersons,
  addPerson,
  editPerson,
  assertExist,
  deletePerson,
};
