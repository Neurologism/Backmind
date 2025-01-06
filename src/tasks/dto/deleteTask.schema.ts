import { z } from 'zod';
import mongoose from 'mongoose';

export const deleteTaskSchema = z
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

export type DeleteTaskDto = z.infer<typeof deleteTaskSchema>;
