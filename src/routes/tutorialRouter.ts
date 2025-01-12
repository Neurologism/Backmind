import express from 'express';
import { schemaValidationMiddleware } from '../middleware/schemaValidationMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { getHandler } from '../handlers/tutorial/getHandler';
import { setStateHandler } from '../handlers/tutorial/setStateHandler';
import { getSchema } from '../zodSchemas/tutorial/getSchema';
import { setStateSchema } from '../zodSchemas/tutorial/setStateSchema';

const router = express.Router();

router.post(
  '/get',
  authMiddleware,
  schemaValidationMiddleware(getSchema),
  getHandler
);

router.post(
  '/set-state',
  authMiddleware,
  schemaValidationMiddleware(setStateSchema),
  setStateHandler
);

export default router;
