import { z } from 'zod';

export const logoutAllSchema = z.object({}).strict();

export type LogoutAllDto = z.infer<typeof logoutAllSchema>;
