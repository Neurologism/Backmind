import express from 'express';
import { schemaValidationMiddleware } from '../middleware/schemaValidationMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { getHandler } from '../handlers/tutorial/getHandler';
import { setStateHandler } from '../handlers/tutorial/setStateHandler';
import { getSchema, setStateSchema } from '../zodSchemas/tutorialSchemas';

const router = express.Router();

router.post(
  '/api/tutorial/get',
  authMiddleware,
  schemaValidationMiddleware(getSchema),
  getHandler
);

router.post(
  '/api/tutorial/set-state',
  authMiddleware,
  schemaValidationMiddleware(setStateSchema),
  setStateHandler
);

export default router;
