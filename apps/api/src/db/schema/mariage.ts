import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { persons } from './person';
import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import { descendants } from './descendant';

export const mariages = sqliteTable('mariage', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  husband_id: integer('husband_id').references(() => persons.id, {
    onDelete: 'set null',
  }),
  wife_id: integer('wife_id').references(() => persons.id, {
    onDelete: 'set null',
  }),
  start_date: text('start_date'),
  end_date: text('end_date'),
  created_at: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer('updated_at', { mode: 'timestamp' }),
});

export const mariageRelations = relations(mariages, ({ many, one }) => ({
  husband: one(persons, {
    fields: [mariages.husband_id],
    references: [persons.id],
    relationName: 'husband',
  }),
  wife: one(persons, {
    fields: [mariages.wife_id],
    references: [persons.id],
    relationName: 'wife',
  }),
  children: many(descendants),
}));

export type Mariage = InferSelectModel<typeof mariages>;
export type MariageInsert = Omit<
  InferInsertModel<typeof mariages>,
  'id' | 'created_at' | 'updated_at'
>;
export type MariageUpdate = Partial<MariageInsert>; // buang-buang tenanga wkwk
