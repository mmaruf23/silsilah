import { HTTPException } from 'hono/http-exception';

export const newUserAlreadyExist = () => {
  return new HTTPException(409, { message: 'username already taken' });
};

export const newRegisterError = (m?: string) => {
  return new HTTPException(400, { message: m ?? 'Register error' });
};

export const newInvalidCredential = () => {
  return new HTTPException(400, {
    message: 'username atau password salah',
  });
};
