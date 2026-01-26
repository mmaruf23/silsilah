import { db } from '@/db';
import { descendants } from '@/db/schema/descendant';
import { newDescendantInsertError } from './descendant.exception';

const addDescendant = async (personId: number, mariageId: number) => {
  const [descendant] = await db
    .insert(descendants)
    .values({ personId, mariageId })
    .onConflictDoNothing()
    .returning();

  if (!descendant) throw newDescendantInsertError();

  return descendant;
};

export default { addDescendant };
