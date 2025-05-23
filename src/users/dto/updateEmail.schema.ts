import { z } from 'zod';

export const updateEmailSchema = z.object({
  user: z
    .object({
      email: z.string().email(),
      emailType: z.string(),
    })
    .strict(),
});

export type UpdateEmailDto = z.infer<typeof updateEmailSchema>;
