import { z } from 'zod';
import mongoose from 'mongoose';

export const componentSchema = z.record(z.any());

export const updateSchema = z
  .object({
    project: z
      .object({
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
        editorType: z.string().optional(),
      })
      .strict(),
  })
  .strict()
  .refine(
    async (data) => {
      return Object.keys(data.project);
    },
    { message: 'You must provide at least one field to update.' }
  );

export type UpdateDto = z.infer<typeof updateSchema>;
