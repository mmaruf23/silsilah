import { db } from '@/db';
import {
  mariages,
  type MariageInsert,
  type MariageUpdate,
} from '@/db/schema/mariage';
import { newInputMariageError } from './mariage.exception';
import { eq } from 'drizzle-orm';
import { newNotFoundError } from '../global/exception';

const addMariage = async (newMariage: MariageInsert) => {
  const [mariage] = await db
    .insert(mariages)
    .values(newMariage)
    .onConflictDoNothing()
    .returning({
      id: mariages.id,
      husband_id: mariages.husband_id,
      wife_id: mariages.wife_id,
      start_date: mariages.start_date,
      end_date: mariages.end_date,
    });

  if (!mariage)
    throw newInputMariageError('fail input mariage data or already exists');

  return mariage;
};

const editMariage = async (id: number, _mariage: MariageUpdate) => {
  if (Object.keys(_mariage).length === 0)
    throw newInputMariageError('tidak ada yang diubah');

  const [mariage] = await db
    .update(mariages)
    .set(_mariage)
    .where(eq(mariages.id, id))
    .returning();

  if (!mariage) throw newInputMariageError('mariageID not found');

  return mariage;
};

const getMariageByID = async (id: number) => {
  const mariage = await db.query.mariages.findFirst({
    where: eq(mariages.id, id),
  });

  if (!mariage) throw newNotFoundError('data mariage tidak ditemukan');

  return mariage;
};

const assertExist = async (id: number) => {
  const exist = await db.query.mariages.findFirst({
    where: eq(mariages.id, id),
    columns: { id: true },
  });

  if (!exist) throw newNotFoundError('person not found');
};

export default { addMariage, editMariage, getMariageByID, assertExist };
