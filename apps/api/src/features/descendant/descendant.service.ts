import { db } from '@/db';
import { descendants } from '@/db/schema/descendant';
import { newDescendantInsertError } from './descendant.exception';
import { persons } from '@/db/schema/person';
import { eq, or } from 'drizzle-orm';
import { newNotFoundError } from '../global/exception';

const addDescendant = async (personId: number, mariageId: number) => {
  const [descendant] = await db
    .insert(descendants)
    .values({ personId, mariageId })
    .onConflictDoNothing()
    .returning();

  if (!descendant) throw newDescendantInsertError();

  return descendant;
};

const getParents = async (personId: number) => {
  const res = await db.query.persons.findFirst({
    columns: {},
    where: eq(persons.id, personId),
    with: {
      asChild: {
        columns: {},
        with: {
          mariages: {
            columns: {},
            with: {
              husband: { columns: { createdAt: false, updatedAt: false } },
              wife: { columns: { createdAt: false, updatedAt: false } },
            },
          },
        },
      },
    },
  });
  if (!res) throw newNotFoundError(`person with id ${personId} not found`);
  if (!res.asChild)
    throw newNotFoundError(`this person hasn't relation to any parents`);

  return {
    father: res.asChild.mariages.husband,
    mother: res.asChild.mariages.wife,
  };
};

const getChildrens = async (personId: number) => {
  const person = await db.query.persons.findFirst({
    columns: { id: true, gender: true },
    where: ({ id }, { eq }) => eq(id, personId),
  });

  if (!person) throw newNotFoundError(`person with id ${personId} not found`);
  const _mariages = await db.query.mariages.findMany({
    columns: { id: true, husband_id: true, wife_id: true },
    where: ({ husband_id, wife_id }, { or, eq }) =>
      or(eq(husband_id, personId), eq(wife_id, personId)),
    with: {
      children: {
        columns: {},
        with: { person: { columns: { createdAt: false, updatedAt: false } } },
      },
      husband: { columns: { createdAt: false, updatedAt: false } },
      wife: { columns: { createdAt: false, updatedAt: false } },
    },
  });

  return _mariages.map((m) => ({
    partner: person.gender === 'male' ? m.wife : m.husband,
    children: m.children.map((c) => c.person),
  }));
};

export default { addDescendant, getParents, getChildrens };
