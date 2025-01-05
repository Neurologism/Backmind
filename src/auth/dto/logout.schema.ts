import { z } from 'zod';

export const logoutSchema = z.object({}).strict();

export type LogoutDto = z.infer<typeof logoutSchema>;
