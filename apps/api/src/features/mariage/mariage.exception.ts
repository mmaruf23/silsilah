import { HTTPException } from 'hono/http-exception';

export const newInputMariageError = (m?: string) => {
  return new HTTPException(400, {
    message: m ?? 'gagal tambah data pernikahan',
  });
};
