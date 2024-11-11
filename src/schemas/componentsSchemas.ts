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

export const operationSchema = z
  .object({
    type: z.string(),
    method: z.string(),
    uid: z.string(),
    args: z.object({}),
  })
  .strict();

export const linkSchema = z
  .object({
    uid: z.string(),
    source: z.string(),
    target: z.string(),
  })
  .strict();

export const componentsSchema = z
  .object({
    operations: z.array(operationSchema),
    links: z.array(linkSchema),
  })
  .strict();
