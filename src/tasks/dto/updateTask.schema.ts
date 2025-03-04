import { z } from 'zod';
import mongoose from 'mongoose';

export const updateTaskSchema = z
  .object({
    task: z.object({
      _id: z.string().length(24),
      // .transform((_id) => new mongoose.Types.ObjectId(_id)),
      name: z.string().min(1).max(255),
    }),
  })
  .strict();

export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
