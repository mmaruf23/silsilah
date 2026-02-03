import { db } from '@/db';
import { users, type User, type UserInsert } from '@/db/schema/user';
import {
  newInvalidCredential,
  newInvalidTokenError,
  newRegisterError,
  newUserAlreadyExist,
} from './auth.exception';
import { eq } from 'drizzle-orm';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import { env } from 'cloudflare:workers';
import type { PayloadrRefreshToken } from '@/types/payload.type';
import { tokens } from '@/db/schema/token';

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

  return user;
};

const issueAccessToken = async (user: User) => {
  return await sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 jam
    },
    env.JWT_SECRET,
  );
};

const issueRefreshToken = async (sub: number) => {
  const maxAge = 60 * 60 * 24 * 30; // 1 bulan
  const expiresAt = new Date(Date.now() + maxAge);
  const uuid = crypto.randomUUID();
  const payload: PayloadrRefreshToken = {
    sub,
    jti: uuid,
    exp: Math.floor(expiresAt.getTime() / 1000),
  };

  const refreshToken = await sign(payload, env.JWT_SECRET); // todo bikin secret khusus refresh token.

  await db.insert(tokens).values({
    id: uuid,
    userId: sub,
    expiresAt,
  });

  return { refreshToken, maxAge };
};

const getRefreshToken = async (payload: PayloadrRefreshToken) => {
  const token = await db.query.tokens.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, payload.jti);
    },
  });

  if (!token) throw newInvalidTokenError('invalid token format');
  if (token.replacedBy) throw newInvalidTokenError('token is used');
  if (token.revokedAt) throw newInvalidTokenError('token tidak sah');
  if (token.expiresAt < new Date()) throw newInvalidTokenError('token expired');

  return token;
};

// nanti kalau udah implement refresh token. baru bikin service logout.
// const logout = async (token: string) => {

// }

export default {
  register,
  login,
  issueAccessToken,
  issueRefreshToken,
  getRefreshToken,
};
