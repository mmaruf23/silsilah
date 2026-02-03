import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import { userRelations, users } from './schema/user';
import { personRelations, persons } from './schema/person';
import { mariageRelations, mariages } from './schema/mariage';
import { descendantRelations, descendants } from './schema/descendant';
import { tokens } from './schema/token';

export const db = drizzle(env.DB, {
  schema: {
    users,
    userRelations,
    persons,
    personRelations,
    mariages,
    mariageRelations,
    descendants,
    descendantRelations,
    tokens,
  },
});
