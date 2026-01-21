import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { persons } from './person';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password'),
  role: text('role', { enum: ['admin', 'user'] })
    .notNull()
    .default('user'),
  personId: integer('person_id').references(() => persons.id, {
    onDelete: 'set null',
  }),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const userRelations = relations(users, ({ one }) => ({
  asAccount: one(persons, {
    fields: [users.personId],
    references: [persons.id],
    relationName: 'account',
  }),
}));

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
