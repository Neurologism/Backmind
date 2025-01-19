import { z } from 'zod';

export const registerSchema = z
  .object({
    user: z
      .object({
        email: z.string().email(),
        brainetTag: z.string().min(Number(process.env.MIN_BRAINET_TAG_LENGTH)),
        plainPassword: z.string().min(Number(process.env.MIN_PASS_LENGTH)),
      })
      .strict(),
    agreedToTermsOfServiceAndPrivacyPolicy: z.boolean(),
  })
  .strict();

export type RegisterDto = z.infer<typeof registerSchema>;
