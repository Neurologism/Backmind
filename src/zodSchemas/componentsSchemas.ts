import { z } from 'zod';

export const componentParametersSchema = z.array(
  z
    .object({
      type: z.enum(['parameter', 'object']),
      value: z.any(),
      parameters: z.lazy((): any => componentParametersSchema).optional(),
    })
    .strict()
);

export const moduleConnectionSchema = z
  .object({
    from: z.string(),
    to: z.string(),
  })
  .strict();

export const moduleSchema = z
  .object({
    type: z.string(),
    parameters: componentParametersSchema,
    position: z.tuple([z.number(), z.number()]),
  })
  .strict();

export const componentsSchema = z
  .object({
    add: z
      .object({
        modules: z.array(moduleSchema),
        connections: z.array(moduleConnectionSchema),
      })
      .strict(),
    train: z
      .object({
        parameters: componentParametersSchema,
      })
      .strict(),
    predict: z
      .object({
        parameters: componentParametersSchema,
      })
      .strict(),
  })
  .strict();
