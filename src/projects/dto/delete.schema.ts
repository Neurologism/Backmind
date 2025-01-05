import { z } from 'zod';

export const deleteSchema = z
  .object({
    project: z
      .object({
        _id: z.string().length(24),
      })
      .strict(),
  })
  .strict();

export type DeleteDto = z.infer<typeof deleteSchema>;
