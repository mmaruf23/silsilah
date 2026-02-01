import { HTTPException } from 'hono/http-exception';

export const newPersonAlreadyExists = () => {
  return new HTTPException(409, {
    message: 'person already exists',
  });
};

export const newInputPersonError = () => {
  return new HTTPException(400, {
    message: 'gagal input new person',
  });
};

export const newInvalidRole = (m?: string) => {
  return new HTTPException(400, {
    message: m ?? 'Invalid role for the person',
  });
};

// export const newUpdatePersonError = () => {
//   return new HTTPException(400, {
//     message: 'gagal update person',
//   });
// };
