import { z } from 'zod';
import mongoose from 'mongoose';

export const setStateSchema = z
  .object({
    setStep: z.number().optional().default(0),
    setCompleted: z.boolean().optional().default(false),
  })
  .strict();

export type SetStateDto = z.infer<typeof setStateSchema>;
