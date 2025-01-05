import { z } from 'zod';
import mongoose from 'mongoose';

export const unfollowSchema = z
  .object({
    user: z
      .object({
        _id: z.string().transform((_id) => new mongoose.Types.ObjectId(_id)),
      })
      .strict(),
  })
  .strict();

export type UnfollowDto = z.infer<typeof unfollowSchema>;
