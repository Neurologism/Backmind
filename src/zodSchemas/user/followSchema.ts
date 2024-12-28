import { z } from 'zod';
import mongoose from 'mongoose';

export const followSchema = z
  .object({
    user: z
      .object({
        _id: z.string().transform((_id) => new mongoose.Types.ObjectId(_id)),
      })
      .strict(),
  })
  .strict();
