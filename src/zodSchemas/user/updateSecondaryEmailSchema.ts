import { z } from 'zod';

export const updateSecondaryEmailSchema = z.object({
  user: z
    .object({
      email: z.string().email(),
    })
    .strict(),
});
