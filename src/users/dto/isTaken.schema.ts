import { z } from 'zod';

export const isTakenSchema = z
  .object({
    user: z
      .object({
        brainetTag: z.string().optional(),
        email: z.string().optional(),
      })
      .strict(),
  })
  .strict()
  .refine(
    (data) => {
      return (
        data.user.brainetTag !== undefined || data.user.email !== undefined
      );
    },
    {
      message:
        'Provide either a brainet tag or an email to check if it is taken.',
    }
  );

export type IsTakenDto = z.infer<typeof isTakenSchema>;
