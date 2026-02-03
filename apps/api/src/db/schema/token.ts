import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './user';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const tokens = sqliteTable('tokens', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  revokedAt: integer('revoked_at', { mode: 'timestamp' }),
  replacedBy: text('replaced_by'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Token = InferSelectModel<typeof tokens>;
export type InsertToken = InferInsertModel<typeof tokens>;
