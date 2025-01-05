import { z } from 'zod';

export const loginSchema = z
  .object({
    user: z
      .object({
        email: z.string().email().optional(),
        brainetTag: z
          .string()
          .min(Number(process.env.MIN_BRAINET_TAG_LENGTH))
          .optional(),
        plainPassword: z.string().min(Number(process.env.MIN_PASS_LENGTH)),
      })
      .strict(),
  })
  .strict()
  .refine(
    async (data) => {
      return !(!data.user.email && !data.user.brainetTag);
    },
    { message: 'Either email or brainetTag must be provided' }
  );

export type LoginDto = z.infer<typeof loginSchema>;
