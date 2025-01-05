import { z } from 'zod';

export const deleteSchema = z.object({}).strict();

export type DeleteDto = z.infer<typeof deleteSchema>;
