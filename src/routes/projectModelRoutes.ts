import express from 'express';
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
} from '../zodSchemas/projectModelSchemas';
import { accessProjectMiddleware } from '../middleware/accessProjectMiddleware';

const router = express.Router();

router.post(
  '/training-start',
  authMiddleware,
  schemaValidationMiddleware(modelStartTrainingSchema),
  accessProjectMiddleware,
  modelStartTraining
);

router.post(
  '/training-stop',
  authMiddleware,
  schemaValidationMiddleware(modelStopTrainingSchema),
  accessProjectMiddleware,
  modelStopTraining
);

router.post(
  '/training-status',
  authMiddleware,
  schemaValidationMiddleware(modelStatusTrainingSchema),
  accessProjectMiddleware,
  modelStatusTraining
);

router.post(
  '/query',
  authMiddleware,
  schemaValidationMiddleware(modelQuerySchema),
  modelQuery
);

router.post(
  '/download',
  authMiddleware,
  schemaValidationMiddleware(modelDownloadSchema),
  modelDownload
);

export default router;
