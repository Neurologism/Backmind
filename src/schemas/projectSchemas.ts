import { z } from 'zod';
import { connectToDatabase } from '../database';
import { ObjectId } from 'mongodb';

export const getProjectSchema = z.object({
  project: z.object({
    _id: z.string().transform((_id) => new ObjectId(_id)),
  }),
});

export const updateProjectSchema = z
  .object({
    project: z.object({
      _id: z.string().transform((_id) => new ObjectId(_id)),
      name: z.string().optional(),
      description: z.string().optional(),
      visibility: z.enum(['public', 'private']).optional(),
      owner_id: z
        .string()
        .optional()
        .transform((owner_id) => new ObjectId(owner_id)),
      contributors: z
        .array(z.string())
        .optional()
        .transform((contributors) =>
          contributors!.map((contributor) => new ObjectId(contributor))
        ),
      plain_password: z
        .string()
        .min(Number(process.env.MIN_PASS_LENGTH))
        .optional(),
      blocks: z.array(z.object({})).optional(),
      variables: z.array(z.object({})).optional(),
    }),
  })
  .refine(
    async (data) => {
      if (
        !data.project.name &&
        !data.project.description &&
        !data.project.visibility &&
        !data.project.owner_id &&
        !data.project.contributors &&
        !data.project.blocks &&
        !data.project.variables
      ) {
        return false;
      }
    },
    { message: 'You must provide at least one field to update.' }
  )
  .refine(
    async (data) => {
      if (data.project.owner_id && !data.project.plain_password) {
        return false;
      }
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

export const updateProjectAsContributorSchema = z.object({
  project: z
    .object({
      project: z.object({
        _id: z.any().refine((_id) => _id instanceof ObjectId, {
          message:
            "Do not parse this schema before _id hasn't been converted to a valid mongodb object id.",
        }),
        description: z.string().optional(),
        blocks: z.array(z.object({})).optional(),
        variables: z.array(z.object({})).optional(),
      }),
    })
    .refine(
      async (data) => {
        if (
          !data.project.description &&
          !data.project.blocks &&
          !data.project.variables
        ) {
          return false;
        }
      },
      { message: 'You must provide at least one field to update.' }
    ),
});

export const createProjectSchema = z.object({
  project: z.object({
    name: z.string().min(Number(process.env.MIN_PROJECT_NAME_LENGTH)),
    description: z.string(),
    visibility: z.enum(['public', 'private']),
  }),
});

export const deleteProjectSchema = z.object({});

export const searchProjectSchema = z.object({});

export const modelStartTrainingSchema = z.object({});

export const modelStopTrainingSchema = z.object({});

export const modelStatusTrainingSchema = z.object({});

export const modelQuerySchema = z.object({});

export const modelDownloadSchema = z.object({});
