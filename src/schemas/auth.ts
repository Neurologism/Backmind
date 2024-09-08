import { z } from 'zod';

export const registerSchema = z.object({
  user: z.object({
    email: z.string().email(),
    brainet_tag: z.string().min(3),
    plain_password: z.string().min(6),
  }),
});

export const loginSchema = z
  .object({
    email: z.string().email().optional(),
    brainet_tag: z.string().min(3).optional(),
    plain_password: z.string().min(6),
  })
  .refine((data) => {
    if (!data.email && !data.brainet_tag) {
      throw new Error('Either email or brainet_tag is required');
    }
    return true;
  });

export const logoutSchema = z.object({});
