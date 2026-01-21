import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { persons } from './person';
import { mariages } from './mariage';
import { relations } from 'drizzle-orm';

export const descendants = sqliteTable('descendant', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => persons.id, { onDelete: 'cascade' }),
  mariageId: integer('mariage_id')
    .notNull()
    .references(() => mariages.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const descendantRelations = relations(descendants, ({ one }) => ({
  user: one(persons, {
    fields: [descendants.userId],
    references: [persons.id],
  }),
  mariages: one(mariages, {
    fields: [descendants.mariageId],
    references: [mariages.id],
  }),
}));
