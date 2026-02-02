import z from 'zod';
import { limitOffsetSchema } from '../global/validator';

export const searchUserSchema = z
  .object({
    username: z.string().min(3).optional(),
    role: z.enum(['admin', 'user']).optional(),
  })
  .extend(limitOffsetSchema.shape);

export type UserFilter = z.infer<typeof searchUserSchema>;
