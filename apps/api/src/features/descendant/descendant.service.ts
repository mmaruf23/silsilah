import { db } from '@/db';
import { descendants } from '@/db/schema/descendant';
import { newDescendantInsertError } from './descendant.exception';
import { persons } from '@/db/schema/person';
import { eq } from 'drizzle-orm';
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
              husband: {
                columns: { createdAt: false, updatedAt: false },
              },
              wife: {
                columns: { createdAt: false, updatedAt: false },
              },
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

export default { addDescendant, getParents };
