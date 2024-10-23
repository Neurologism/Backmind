import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../utility/connectToDatabase';

export const modelStartTrainingSchema = z
  .object({
    project: z
      .object({
        _id: z
          .string()
          .length(24)
          .transform((_id) => new ObjectId(_id)),
      })
      .strict(),
  })
  .strict();

export const modelStopTrainingSchema = z
  .object({
    model: z
      .object({
        _id: z
          .string()
          .length(24)
          .transform((_id) => new ObjectId(_id)),
      })
      .strict(),
  })
  .strict()
  .transform(async (data: any) => {
    const db = await connectToDatabase();
    const dbModels = db.collection('models');
    const model = await dbModels.findOne({ _id: data.model._id });
    data.model = model;
    return data;
  })
  .refine(
    (data) => {
      if (data.model === null) {
        return false;
      }
      return true;
    },
    { message: 'Model with that id does not exist.' }
  )
  .transform((data) => {
    data.project = { _id: data.model.project_id };
    return data;
  });

export const modelStatusTrainingSchema = z
  .object({
    model: z
      .object({
        _id: z
          .string()
          .length(24)
          .transform((_id) => new ObjectId(_id)),
      })
      .strict(),
  })
  .strict()
  .transform(async (data: any) => {
    const db = await connectToDatabase();
    const dbModels = db.collection('models');
    const model = await dbModels.findOne({ _id: data.model._id });
    data.model = model;
    return data;
  })
  .refine(
    (data) => {
      if (data.model === null) {
        return false;
      }
      return true;
    },
    { message: 'Model with that id does not exist.' }
  )
  .transform((data) => {
    data.project = { _id: data.model.project_id };
    return data;
  });

export const modelQuerySchema = z.object({}).strict();

export const modelDownloadSchema = z.object({}).strict();
