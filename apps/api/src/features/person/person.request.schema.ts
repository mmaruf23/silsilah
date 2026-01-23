import z from 'zod';

export const searchQueryShema = z.object({
  name: z.string().min(3).optional(),
  address: z.string().min(3).optional(),
});

export const createPersonSchema = z.object({
  name: z.string().min(3),
  fullname: z.string().min(3).optional(),
  address: z.string().min(3),
  gender: z.enum(['male', 'female']),
  birthDate: z.string().datetime().optional(),
  deathDate: z.iso.date().optional(),
});

// todo : test input person pake birthdate / deathdate, pengen tahu gimana cara kasih inputnya lewat request body
