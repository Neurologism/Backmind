import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { createHandler } from '../handlers/project/createHandler';
import { deleteHandler } from '../handlers/project/deleteHandler';
import { getHandler } from '../handlers/project/getHandler';
import { isTakenHandler } from '../handlers/project/isTakenHandler';
import { searchHandler } from '../handlers/project/searchHandler';
import { updateHandler } from '../handlers/project/updateHandler';

import { schemaValidationMiddleware } from '../middleware/schemaValidationMiddleware';
import { getSchema } from '../zodSchemas/project/getSchema';
import { updateSchema } from '../zodSchemas/project/updateSchema';
import { createSchema } from '../zodSchemas/project/createSchema';
import { deleteSchema } from '../zodSchemas/project/deleteSchema';
import { searchSchema } from '../zodSchemas/project/searchSchema';
import { isTakenSchema } from '../zodSchemas/project/isTakenSchema';
import { getProjectMiddleware } from '../middleware/getProjectMiddleware';
import { accessProjectMiddleware } from '../middleware/accessProjectMiddleware';

const router = express.Router();

router.post(
  '/create',
  authMiddleware,
  schemaValidationMiddleware(createSchema),
  createHandler
);

router.post(
  '/delete',
  authMiddleware,
  schemaValidationMiddleware(deleteSchema),
  accessProjectMiddleware,
  deleteHandler
);

router.post(
  '/get',
  authMiddleware,
  schemaValidationMiddleware(getSchema),
  getProjectMiddleware,
  getHandler
);

router.post(
  '/is-taken',
  authMiddleware,
  schemaValidationMiddleware(isTakenSchema),
  isTakenHandler
);

router.post(
  '/search',
  authMiddleware,
  schemaValidationMiddleware(searchSchema),
  searchHandler
);

router.post(
  '/update',
  authMiddleware,
  schemaValidationMiddleware(updateSchema),
  accessProjectMiddleware,
  updateHandler
);

export default router;
