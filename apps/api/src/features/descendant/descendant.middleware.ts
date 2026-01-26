import z from 'zod';
import { jsonValidator } from '../global/validator';

const newDescendantSchema = z.object({
  personId: z.number().min(1),
  mariageId: z.number().min(1),
});

export const newDescendantValidator = jsonValidator(newDescendantSchema);
