import { z } from 'zod';
import mongoose from 'mongoose';

export const trainingStartSchema = z
  .object({
    project: z
      .object({
        _id: z.string().length(24),
        // .transform((_id) => new mongoose.Types.ObjectId(_id)),
        startNodeId: z.string(),
      })
      .strict(),
  })
  .strict();

export type TrainingStartDto = z.infer<typeof trainingStartSchema>;
