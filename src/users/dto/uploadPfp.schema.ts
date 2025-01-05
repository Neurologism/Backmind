import { z } from 'zod';

export const uploadPfpSchema = z.object({}).strict();

export type UploadPfpDto = z.infer<typeof uploadPfpSchema>;
