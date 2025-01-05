import { z } from 'zod';

export const getCreditsSchema = z.object({}).strict();

export type GetCreditsDto = z.infer<typeof getCreditsSchema>;
