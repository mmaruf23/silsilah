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
import { tokens, type Token } from '@/db/schema/token';
import { newNotFoundError } from '../global/exception';

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
  const expiresAt = new Date(Date.now() + env.MAX_AGE_JWT_REFRESH);
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

  return { refreshToken, jti: uuid };
};

const rotateToken = async (payload: PayloadrRefreshToken) => {
  const oldToken = await db.query.tokens.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, payload.jti);
    },
  });

  if (!oldToken) throw newInvalidTokenError('invalid token format');
  if (oldToken.replacedBy) throw newInvalidTokenError('token is used');
  if (oldToken.revokedAt) throw newInvalidTokenError('token tidak sah');
  if (oldToken.expiresAt < new Date())
    throw newInvalidTokenError('token expired'); // just in case

  const { refreshToken, jti } = await issueRefreshToken(oldToken.userId);

  await db
    .update(tokens)
    .set({
      replacedBy: jti,
      revokedAt: new Date(),
    })
    .where(eq(tokens.id, oldToken.id));

  return refreshToken;
};

const logout = async (payload: PayloadrRefreshToken) => {
  const status = await db
    .update(tokens)
    .set({
      revokedAt: new Date(),
    })
    .where(eq(tokens.id, payload.jti));

  if (!status.meta.changes)
    throw newNotFoundError('failed logout, cannot found any account');
};

const logoutAll = async (payload: PayloadrRefreshToken) => {
  const status = await db
    .update(tokens)
    .set({
      revokedAt: new Date(),
    })
    .where(eq(tokens.userId, payload.sub));

  if (!status.meta.changes)
    throw newNotFoundError(
      'failed logout all devices, cannot fount any account',
    );
};

export default {
  register,
  login,
  issueAccessToken,
  issueRefreshToken,
  rotateToken,
  logout,
};
