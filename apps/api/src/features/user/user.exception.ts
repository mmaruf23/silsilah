import { HTTPException } from 'hono/http-exception';

export const newUserNotFound = (u?: string) => {
  return new HTTPException(404, {
    message: u
      ? `user with username : ${u} not found or deleted`
      : 'user not found or deleted',
  });
};
