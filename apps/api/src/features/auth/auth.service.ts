import { db } from '@/db';
import { users, type UserInsert } from '@/db/schema/user';
import {
  newInvalidCredential,
  newRegisterError,
  newUserAlreadyExist,
} from './auth.exception';
import { eq } from 'drizzle-orm';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import { env } from 'cloudflare:workers';

const register = async (userInput: UserInsert) => {
  if (userInput.password)
    userInput.password = bcrypt.hashSync(userInput.password, 10);

  const result = await db
    .insert(users)
    .values(userInput)
    .onConflictDoNothing()
    .catch((err) => {
      console.error('error bukan conflict', err);
      throw newRegisterError();
    });

  if (!result.meta.last_row_id) throw newUserAlreadyExist();
  return { id: result.meta.last_row_id };
};

const login = async ({
  username,
  password,
}: {
  username: string;
  password: string | null;
}) => {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });
  if (!user) throw newInvalidCredential();
  if (user.password || password) {
    if (!password || !user.password) throw newInvalidCredential();
    if (!bcrypt.compareSync(password, user.password))
      throw newInvalidCredential();
  }

  const token = await sign(
    {
      sub: user.username,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 jam
    },
    env.JWT_SECRET,
  );

  return { token };
};

// nanti kalau udah implement refresh token. baru bikin service logout.
// const logout = async (token: string) => {

// }

export default { register, login };
