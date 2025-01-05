import { z } from 'zod';

export const searchSchema = z
  .object({
    query: z.object({ q: z.string().min(1) }).strict(),
  })
  .strict();

export type SearchDto = z.infer<typeof searchSchema>;
