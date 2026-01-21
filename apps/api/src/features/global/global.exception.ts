import { HTTPException } from 'hono/http-exception';

export const newNotFoundError = (m?: string) => {
  return new HTTPException(404, { message: m });
};
