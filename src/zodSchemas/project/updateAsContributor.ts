import { z } from 'zod';
import mongoose from 'mongoose';
import { componentsSchema } from '../componentsSchemas';

export const updateAsContributorSchema = z
  .object({
    project: z
      .object({
        _id: z.any().refine((_id) => _id instanceof mongoose.Types.ObjectId, {
          message:
            "Do not parse this schema before _id hasn't been converted to a valid mongoose object id.",
        }),
        description: z.string().optional(),
        components: componentsSchema.optional(),
      })
      .strict(),
  })
  .strict()
  .refine(
    async (data) => {
      return !(!data.project.description && !data.project.components);
    },
    { message: 'You must provide at least one field to update.' }
  );
