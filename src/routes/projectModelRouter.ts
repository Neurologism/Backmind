import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { downloadHandler } from '../handlers/projectModel/downloadHandler';
import { queryHandler } from '../handlers/projectModel/queryHandler';
import { trainingStartHandler } from '../handlers/projectModel/trainingStartHandler';
import { trainingStatusHandler } from '../handlers/projectModel/trainingStatusHandler';
import { trainingStopHandler } from '../handlers/projectModel/trainingStopHandler';
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
  '/download',
  authMiddleware,
  schemaValidationMiddleware(modelDownloadSchema),
  downloadHandler
);

router.post(
  '/query',
  authMiddleware,
  schemaValidationMiddleware(modelQuerySchema),
  queryHandler
);

router.post(
  '/training-start',
  authMiddleware,
  schemaValidationMiddleware(modelStartTrainingSchema),
  accessProjectMiddleware,
  trainingStartHandler
);

router.post(
  '/training-status',
  authMiddleware,
  schemaValidationMiddleware(modelStatusTrainingSchema),
  accessProjectMiddleware,
  trainingStatusHandler
);

router.post(
  '/training-stop',
  authMiddleware,
  schemaValidationMiddleware(modelStopTrainingSchema),
  accessProjectMiddleware,
  trainingStopHandler
);

export default router;
