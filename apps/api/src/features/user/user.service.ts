import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/user';
import { newUserNotFound } from './user.exception';
import type { UserFilter } from './user.middleware';

const getUserProfile = async (username: string) => {
  const user = await db.query.users.findFirst({
    columns: { password: false },
    with: { asAccount: true },
    where: eq(users.username, username),
  });

  if (!user) throw newUserNotFound(username);

  return user;
};

const getAllUser = async (query: UserFilter) => {
  const data = await db.query.users.findMany({
    columns: { password: false },
    where: ({ username, role }, { and, eq }) =>
      and(
        query.username ? eq(username, query.username) : undefined,
        query.role ? eq(role, query.role) : undefined,
      ),
    limit: query.per_page,
    offset: (query.page - 1) * query.per_page,
  });

  const total = await db.$count(
    users,
    and(
      query.username ? eq(users.username, query.username) : undefined,
      query.role ? eq(users.role, query.role) : undefined,
    ),
  );

  return { data, total };
};

const findUserByID = async (id: number) => {
  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });
  if (!user) throw newUserNotFound();
  return user;
};

export default { getUserProfile, getAllUser, findUserByID };
