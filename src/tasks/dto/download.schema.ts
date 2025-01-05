import { z } from 'zod';

export const downloadSchema = z.object({}).strict();

export type DownloadDto = z.infer<typeof downloadSchema>;
