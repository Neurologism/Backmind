import { z } from 'zod';

export const swapPrimaryEmailSchema = z.object({}).strict();

export type SwapPrimaryEmailDto = z.infer<typeof swapPrimaryEmailSchema>;
