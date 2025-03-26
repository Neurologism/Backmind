import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    plainPassword: z.string().min(Number(process.env.MIN_PASS_LENGTH)),
  })
  .strict();

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
