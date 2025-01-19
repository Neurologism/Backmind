import { z } from 'zod';
import mongoose from 'mongoose';

export const componentSchema = z.record(z.any());

export const updateSchema = z
  .object({
    project: z
      .object({
        _id: z
          .string()
          .length(24)
          .transform((_id) => new mongoose.Types.ObjectId(_id)),
        name: z.string().optional(),
        description: z.string().optional(),
        visibility: z.enum(['public', 'private']).optional(),
        ownerId: z
          .string()
          .length(24)
          .optional()
          .transform((ownerId) => {
            if (ownerId === undefined) {
              return undefined;
            }
            return new mongoose.Types.ObjectId(ownerId);
          }),
        components: componentSchema.optional(),
      })
      .strict(),
  })
  .strict()
  .refine(
    async (data) => {
      return !(
        !data.project.name &&
        !data.project.description &&
        !data.project.visibility &&
        !data.project.ownerId &&
        !data.project.components
      );
    },
    { message: 'You must provide at least one field to update.' }
  );

export type UpdateDto = z.infer<typeof updateSchema>;
