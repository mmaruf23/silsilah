import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { mariages } from './mariage';
import { descendants } from './descendant';

export const persons = sqliteTable(
  'persons',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    fullname: text('fullname'),
    address: text('address').notNull(),
    gender: text('gender').notNull().$type<'male' | 'female'>(),
    birthDate: integer('birth_date', { mode: 'timestamp' }),
    deathDate: integer('death_date', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }),
  },
  (t) => [
    unique('name_address_unique_constraint').on(t.name, t.fullname, t.address),
  ],
);

export const personRelations = relations(persons, ({ many, one }) => ({
  asHusband: many(mariages, { relationName: 'husband' }),
  asWife: many(mariages, { relationName: 'wife' }),
  asChild: one(descendants),
}));

export type Person = InferSelectModel<typeof persons>;
export type PersonInsert = InferInsertModel<typeof persons>;
export type PersonUpdate = Partial<
  Omit<PersonInsert, 'id' | 'createdAt' | 'updatedAt'>
>;
