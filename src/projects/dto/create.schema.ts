import { z } from 'zod';

export const createSchema = z
  .object({
    project: z
      .object({
        name: z.string().min(Number(process.env.MIN_PROJECT_NAME_LENGTH)),
        description: z.string(),
        visibility: z.enum(['public', 'private']),
      })
      .strict(),
  })
  .strict();

export type CreateDto = z.infer<typeof createSchema>;
