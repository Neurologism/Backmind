import { z } from 'zod';
import mongoose from 'mongoose';
import { componentsSchema } from '../componentsSchemas';

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
        contributors: z
          .array(z.string().length(24))
          .optional()
          .transform((contributors) => {
            if (contributors === undefined) {
              return undefined;
            }
            return contributors!.map(
              (contributor) => new mongoose.Types.ObjectId(contributor)
            );
          }),
        plainPassword: z
          .string()
          .min(Number(process.env.MIN_PASS_LENGTH))
          .optional(),
        components: componentsSchema.optional(),
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
        !data.project.contributors &&
        !data.project.components
      );
    },
    { message: 'You must provide at least one field to update.' }
  )
  .refine(
    async (data) => {
      return !(data.project.ownerId && !data.project.plainPassword);
    },
    {
      message:
        'If you are changing the owner of the project, you must provide a password.',
    }
  );

export type UpdateDto = z.infer<typeof updateSchema>;
