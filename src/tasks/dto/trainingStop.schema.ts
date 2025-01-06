import { z } from 'zod';
import mongoose from 'mongoose';

export const trainingStopSchema = z
  .object({
    model: z
      .object({
        _id: z
          .string()
          .length(24)
          .transform((_id) => new mongoose.Types.ObjectId(_id)),
      })
      .strict(),
  })
  .strict();

export type TrainingStopDto = z.infer<typeof trainingStopSchema>;
