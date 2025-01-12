import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { downloadHandler } from '../handlers/projectModel/downloadHandler';
import { queryHandler } from '../handlers/projectModel/queryHandler';
import { trainingStartHandler } from '../handlers/projectModel/trainingStartHandler';
import { trainingStatusHandler } from '../handlers/projectModel/trainingStatusHandler';
import { trainingStopHandler } from '../handlers/projectModel/trainingStopHandler';
import { deleteTaskHandler } from '../handlers/projectModel/deleteTaskHandler';
import { schemaValidationMiddleware } from '../middleware/schemaValidationMiddleware';
import { trainingStartSchema } from '../zodSchemas/projectModel/trainingStartSchema';
import { trainingStopSchema } from '../zodSchemas/projectModel/trainingStopSchema';
import { trainingStatusSchema } from '../zodSchemas/projectModel/trainingStatus';
import { querySchema } from '../zodSchemas/projectModel/querySchema';
import { downloadSchema } from '../zodSchemas/projectModel/downloadSchema';
import { deleteTaskSchema } from '../zodSchemas/projectModel/deleteTaskSchema';
import { accessProjectMiddleware } from '../middleware/accessProjectMiddleware';

const router = express.Router();

router.post(
  '/download',
  authMiddleware,
  schemaValidationMiddleware(downloadSchema),
  accessProjectMiddleware,
  downloadHandler
);

router.post(
  '/query',
  authMiddleware,
  schemaValidationMiddleware(querySchema),
  accessProjectMiddleware,
  queryHandler
);

router.post(
  '/training-start',
  authMiddleware,
  schemaValidationMiddleware(trainingStartSchema),
  accessProjectMiddleware,
  trainingStartHandler
);

router.post(
  '/training-status',
  authMiddleware,
  schemaValidationMiddleware(trainingStatusSchema),
  accessProjectMiddleware,
  trainingStatusHandler
);

router.post(
  '/training-stop',
  authMiddleware,
  schemaValidationMiddleware(trainingStopSchema),
  accessProjectMiddleware,
  trainingStopHandler
);

router.post(
  '/delete-task',
  authMiddleware,
  schemaValidationMiddleware(deleteTaskSchema),
  accessProjectMiddleware,
  deleteTaskHandler
);

export default router;
