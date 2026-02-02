import type { ErrorHandler, NotFoundHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const errorHandler: ErrorHandler = (err, c) => {
  if (!(err instanceof HTTPException)) {
    console.error(err.cause || err.message);
    return c.text('INTERNAL ERROR', 500);
  }

  const res = {
    success: false,
    code: err.status,
    message: err.message,
    errors: err.cause,
  };
  return c.json(res, res.code);
};

export const notFoundHandler: NotFoundHandler = (c) => {
  return c.json(
    {
      success: false,
      code: 404,
      message: 'LOST IN SPACE?',
    },
    404,
  );
};
