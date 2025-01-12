import { z } from 'zod';
import mongoose from 'mongoose';

export const getSchema = z
  .object({
    project: z
      .object({
        _id: z
          .string()
          .length(24)
          .transform((_id) => new mongoose.Types.ObjectId(_id)),
      })
      .strict(),
  })
  .strict();
