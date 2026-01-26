import z from 'zod';
import { jsonValidator } from '../global/validator';

const newMariageSchema = z
  .object({
    husband_id: z.number().min(1).optional(),
    wife_id: z.number().min(1).optional(),
    start_date: z.iso.date().optional(),
    end_date: z.iso.date().optional(),
  })
  .refine((data) => data.husband_id || data.wife_id, {
    error: 'husband_id or wife_id need to fill',
    path: ['husband_id'],
  });

export const newMariageValidator = jsonValidator(newMariageSchema);
export const editMariageValidator = newMariageValidator;
