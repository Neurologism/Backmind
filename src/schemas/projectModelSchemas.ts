import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { componentsSchema } from './componentsSchemas';

export const modelStartTrainingSchema = z.object({}).strict();

export const modelStopTrainingSchema = z.object({}).strict();

export const modelStatusTrainingSchema = z.object({}).strict();

export const modelQuerySchema = z.object({}).strict();

export const modelDownloadSchema = z.object({}).strict();
