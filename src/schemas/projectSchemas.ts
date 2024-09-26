import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { componentsSchema } from './componentsSchemas';

export const getProjectSchema = z
  .object({
    project: z
      .object({
        _id: z.string().transform((_id) => new ObjectId(_id)),
      })
      .strict(),
  })
  .strict();

export const updateProjectSchema = z
  .object({
    project: z
      .object({
        _id: z.string().transform((_id) => new ObjectId(_id)),
        name: z.string().optional(),
        description: z.string().optional(),
        visibility: z.enum(['public', 'private']).optional(),
        owner_id: z
          .string()
          .optional()
          .transform((owner_id) => {
            if (owner_id === undefined) {
              return undefined;
            }
            return new ObjectId(owner_id);
          }),
        contributors: z
          .array(z.string())
          .optional()
          .transform((contributors) => {
            if (contributors === undefined) {
              return undefined;
            }
            return contributors!.map(
              (contributor) => new ObjectId(contributor)
            );
          }),
        plain_password: z
          .string()
          .min(Number(process.env.MIN_PASS_LENGTH))
          .optional(),
        components: componentsSchema.optional(),
        camera_position: z
          .tuple([z.number(), z.number(), z.number()])
          .optional(),
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
        !data.project.owner_id &&
        !data.project.contributors &&
        !data.project.components &&
        !data.project.camera_position
      ) {
        return false;
      }
      return true;
    },
    { message: 'You must provide at least one field to update.' }
  )
  .refine(
    async (data) => {
      if (data.project.owner_id && !data.project.plain_password) {
        return false;
      }
      return true;
    },
    {
      message:
        'If you are changing the owner of the project, you must provide a password.',
    }
  )
  .transform(async (data: any) => {
    data.project.last_edited = Date.now();
    return data;
  });

export const updateProjectAsContributorSchema = z
  .object({
    project: z
      .object({
        _id: z.any().refine((_id) => _id instanceof ObjectId, {
          message:
            "Do not parse this schema before _id hasn't been converted to a valid mongodb object id.",
        }),
        description: z.string().optional(),
        components: componentsSchema.optional(),
        camera_position: z
          .tuple([z.number(), z.number(), z.number()])
          .optional(),
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

export const deleteProjectSchema = z.object({}).strict();

export const searchProjectSchema = z
  .object({
    query: z.object({ q: z.string().min(1) }).strict(),
  })
  .strict();
