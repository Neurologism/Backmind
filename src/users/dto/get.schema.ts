import { z } from 'zod';
import mongoose from 'mongoose';

export const getSchema = z
  .object({
    user: z
      .object({
        _id: z
          .string()
          .optional()
          .transform((_id) => {
            if (_id !== undefined) {
              return new mongoose.Types.ObjectId(_id);
            }
          }),
        brainetTag: z.string().optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .refine(
    async (data) => {
      return !(data.user !== undefined && Object.keys(data.user).length === 0);
    },
    {
      message:
        'Provide user id or brainet tag. Do not provide an empty user object.',
    }
  );

export type GetDto = z.infer<typeof getSchema>;
