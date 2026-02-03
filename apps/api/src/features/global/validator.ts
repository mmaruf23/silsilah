import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';
import z from 'zod';

export const limitOffsetSchema = z.object({
  per_page: z.coerce.number().min(1).optional(),
  page: z.coerce.number().min(1).optional(),
});

export const paramValidator = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) =>
  validator('param', (value) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      const errFlat = z.flattenError(parsed.error);
      throw new HTTPException(400, {
        message: 'BAD REQUEST',
        cause: errFlat.fieldErrors,
      });
    }

    return parsed.data;
  });

export const queryValidator = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) =>
  validator('query', (value) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      const errFlat = z.flattenError(parsed.error);
      throw new HTTPException(400, {
        message: 'BAD REQUEST',
        cause: errFlat.fieldErrors,
      });
    }

    return parsed.data;
  });

export const jsonValidator = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) =>
  validator('json', (value) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      const errFlat = z.flattenError(parsed.error);
      throw new HTTPException(400, {
        message: 'BAD REQUEST',
        cause: errFlat.fieldErrors,
      });
    }

    return parsed.data;
  });

export const IDParamValidator = paramValidator(
  z.object({ id: z.coerce.number() }),
);
