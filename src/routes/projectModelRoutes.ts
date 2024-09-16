import express from 'express';
import { dbMiddleware } from '../middleware/dbMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  modelStartTraining,
  modelStopTraining,
  modelStatusTraining,
  modelQuery,
  modelDownload,
} from '../controllers/projectModelController';
import { schemaValidationMiddleware } from '../middleware/schemaValidationMiddleware';
import {
  modelStartTrainingSchema,
  modelStopTrainingSchema,
  modelStatusTrainingSchema,
  modelQuerySchema,
  modelDownloadSchema,
} from '../schemas/projectModelSchemas';

const router = express.Router();

router.post(
  '/training-start',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(modelStartTrainingSchema),
  modelStartTraining
);

router.post(
  '/training-stop',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(modelStopTrainingSchema),
  modelStopTraining
);

router.post(
  '/training-status',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(modelStatusTrainingSchema),
  modelStatusTraining
);

router.post(
  '/query',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(modelQuerySchema),
  modelQuery
);

router.post(
  '/download',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(modelDownloadSchema),
  modelDownload
);

export default router;
