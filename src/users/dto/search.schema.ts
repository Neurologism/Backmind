import { z } from 'zod';

export const searchSchema = z.object({}).strict();

export type SearchDto = z.infer<typeof searchSchema>;
