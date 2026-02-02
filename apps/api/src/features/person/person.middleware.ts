import z from 'zod';
import { limitOffsetSchema } from '../global/validator';

export const searchPersonShema = z
  .object({
    name: z.string().min(3).optional(),
    address: z.string().min(3).optional(),
  })
  .extend(limitOffsetSchema.shape);

export const newPersonSchema = z.object({
  name: z.string().min(3),
  fullname: z.string().min(3).optional(),
  address: z.string().min(3),
  gender: z.enum(['male', 'female']),
  birthDate: z.iso.date().optional(),
  deathDate: z.iso.date().optional(),
});

export const updatePersonSchema = z.object({
  name: z.string().min(3).optional(),
  fullname: z.string().min(3).optional(),
  address: z.string().min(3).optional(),
  gender: z.enum(['male', 'female']).optional(),
  birthDate: z.iso.date().optional(),
  deathDate: z.iso.date().optional(),
});

// next : bikin dry

export type PersonFilter = z.infer<typeof searchPersonShema>;
