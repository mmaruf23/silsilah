import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema/user';
import { newUserNotFound } from './user.exception';

const getUserProfile = async (username: string) => {
  const user = await db.query.users.findFirst({
    columns: { password: false },
    with: { asAccount: true },
    where: eq(users.username, username),
  });

  if (!user) throw newUserNotFound(username);

  return user;
};

const getAllUser = async (limit?: number, offset?: number) => {
  const _users = await db.query.users.findMany({
    columns: { password: false },
    limit: limit,
    offset: offset,
  });

  return _users;
};

export default { getUserProfile, getAllUser };
