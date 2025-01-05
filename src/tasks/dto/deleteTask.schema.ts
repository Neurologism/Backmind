import { z } from 'zod';
import mongoose from 'mongoose';
import { TaskModel } from '../../../mongooseSchemas/task.schema';

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
  .strict()
  .transform(async (data: any) => {
    data.model = await TaskModel.findOne({ _id: data.model._id });
    return data;
  })
  .refine(
    (data) => {
      return data.model !== null;
    },
    { message: 'Model with that id does not exist.' }
  )
  .transform((data) => {
    data.project = { _id: data.model.projectId };
    return data;
  });

export type DeleteTaskDto = z.infer<typeof deleteTaskSchema>;
