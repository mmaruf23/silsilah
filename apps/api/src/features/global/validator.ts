import type { ApiResponse } from '@/types/response.type';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';
import z from 'zod';

export const limitOffsetSchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().min(1).optional(),
});

export const paramValidator = (schema: z.ZodObject) =>
  zValidator('param', schema, (result, c) => {
    if (!result.success) {
      const errFlat = z.treeifyError(result.error);
      return c.json<ApiResponse<typeof errFlat.properties>>({
        success: false,
        code: 400,
        message: 'BAD REQUEST',
        errors: errFlat.properties,
      });
    }
  });
export const queryValidator = (schema: z.ZodObject) =>
  zValidator('query', schema, (result, c) => {
    if (!result.success) {
      const errFlat = z.treeifyError(result.error);
      return c.json<ApiResponse<typeof errFlat.properties>>({
        success: false,
        code: 400,
        message: 'BAD REQUEST',
        errors: errFlat.properties,
      });
    }
  });

export const jsonValidator = (schema: z.ZodObject) =>
  validator('json', (value) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      const errFlat = z.treeifyError(parsed.error);
      throw new HTTPException(400, {
        message: 'BAD REQUEST',
        cause: errFlat.properties,
      });
    }

    return parsed.data;
  });
