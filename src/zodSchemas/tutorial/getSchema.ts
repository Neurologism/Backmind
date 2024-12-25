import { z } from 'zod';
import mongoose from 'mongoose';

export const getSchema = z
  .object({
    tutorialId: z
      .string()
      .length(24)
      .transform((_id) => new mongoose.Types.ObjectId(_id))
      .optional(),
    tutorialName: z.string().optional(),
  })
  .refine((data) => data.tutorialId || data.tutorialName, {
    message: 'Either tutorialId or tutorialName must be set',
  });
