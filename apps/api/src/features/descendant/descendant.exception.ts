import { HTTPException } from 'hono/http-exception';

export const newDescendantInsertError = () => {
  return new HTTPException(400, {
    message: 'gagal input data keturunan baru',
  });
};
