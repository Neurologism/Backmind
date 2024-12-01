import { z } from 'zod';
import mongoose from 'mongoose';

export const getSchema = z
  .object({
    tutorialId: z
      .string()
      .length(24)
      .transform((_id) => new mongoose.Types.ObjectId(_id)),
  })
  .strict();

export const setStateSchema = z
  .object({
    tutorialId: z
      .string()
      .length(24)
      .transform((_id) => new mongoose.Types.ObjectId(_id)),
    setStep: z.number(),
    setCompleted: z.boolean().optional(),
  })
  .strict();
