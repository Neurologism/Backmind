import { z } from 'zod';

export const isTakenSchema = z
  .object({
    project: z
      .object({
        name: z.string(),
      })
      .strict(),
  })
  .strict();
