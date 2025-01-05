import { z } from 'zod';

export const querySchema = z.object({}).strict();

export type QueryDto = z.infer<typeof querySchema>;
