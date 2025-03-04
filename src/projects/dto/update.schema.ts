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
          .transform((val) => new mongoose.Types.ObjectId(val))
          .optional(),
        components: componentSchema.optional(),
        editorType: z.string().optional(),
      })
      .strict(),
  })
  .strict();

export type UpdateDto = z.infer<typeof updateSchema>;
