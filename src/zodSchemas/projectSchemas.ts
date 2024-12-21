import { z } from 'zod';
import mongoose from 'mongoose';
import { componentsSchema } from './componentsSchemas';

export const getProjectSchema = z
  .object({
    project: z
      .object({
        _id: z
          .string()
          .length(24)
          .transform((_id) => new mongoose.Types.ObjectId(_id)),
      })
      .strict(),
  })
  .strict();

export const updateProjectSchema = z
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
      if (
        !data.project.name &&
        !data.project.description &&
        !data.project.visibility &&
        !data.project.ownerId &&
        !data.project.contributors &&
        !data.project.components
      ) {
        return false;
      }
      return true;
    },
    { message: 'You must provide at least one field to update.' }
  )
  .refine(
    async (data) => {
      if (data.project.ownerId && !data.project.plainPassword) {
        return false;
      }
      return true;
    },
    {
      message:
        'If you are changing the owner of the project, you must provide a password.',
    }
  );

export const updateProjectAsContributorSchema = z
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
      if (!data.project.description && !data.project.components) {
        return false;
      }
      return true;
    },
    { message: 'You must provide at least one field to update.' }
  );

export const createProjectSchema = z
  .object({
    project: z
      .object({
        name: z.string().min(Number(process.env.MIN_PROJECT_NAME_LENGTH)),
        description: z.string(),
        visibility: z.enum(['public', 'private']),
      })
      .strict(),
  })
  .strict();

export const deleteProjectSchema = z
  .object({
    project: z
      .object({
        _id: z.string().length(24),
      })
      .strict(),
  })
  .strict();

export const searchProjectSchema = z
  .object({
    query: z.object({ q: z.string().min(1) }).strict(),
  })
  .strict();

export const isTakenProjectSchema = z
  .object({
    project: z
      .object({
        name: z.string(),
      })
      .strict(),
  })
  .strict();
