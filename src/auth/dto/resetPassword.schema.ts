import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    user: z
      .object({
        plainPassword: z.string().min(Number(process.env.MIN_PASS_LENGTH)),
      })
      .strict(),
  })
  .strict();

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
