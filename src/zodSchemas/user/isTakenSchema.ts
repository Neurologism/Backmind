import { z } from 'zod';
import { isEmptyObject } from '../../utility/isEmptyObject';

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
      return !isEmptyObject(data.user);
    },
    {
      message:
        'Provide either a brainet tag or an email to check if it is taken.',
    }
  );
