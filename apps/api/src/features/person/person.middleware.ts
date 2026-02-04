import z from 'zod';
import { limitOffsetSchema } from '../global/validator';

const nameSchema = z.string().min(3);
const fullnameSchema = z.string().min(3);
const addressSchema = z.string().min(3);
const genderSchema = z.enum(['male', 'female']);
const birthDateSchema = z.iso.date();
const deathDateSchema = z.iso.date();

export const searchPersonShema = z
  .object({
    name: nameSchema.optional(),
    address: addressSchema.optional(),
  })
  .extend(limitOffsetSchema.shape);

export const newPersonSchema = z.object({
  name: nameSchema,
  fullname: fullnameSchema.optional(),
  address: addressSchema,
  gender: genderSchema,
  birthDate: birthDateSchema.optional(),
  deathDate: deathDateSchema.optional(),
});

export const updatePersonSchema = z.object({
  name: nameSchema.optional(),
  fullname: fullnameSchema.optional(),
  address: addressSchema.optional(),
  gender: genderSchema.optional(),
  birthDate: birthDateSchema.optional(),
  deathDate: birthDateSchema.optional(),
});

export type PersonFilter = z.infer<typeof searchPersonShema>;
