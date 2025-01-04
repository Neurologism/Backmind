import { z } from 'zod';

export const deleteEmailSchema = z.object({
  user: z
    .object({
      emailType: z.string().optional(),
    })
    .strict(),
});
