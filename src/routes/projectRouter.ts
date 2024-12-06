import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { createHandler } from '../handlers/project/createHandler';
import { deleteHandler } from '../handlers/project/deleteHandler';
import { getHandler } from '../handlers/project/getHandler';
import { isTakenHandler } from '../handlers/project/isTakenHandler';
import { searchHandler } from '../handlers/project/searchHandler';
import { updateHandler } from '../handlers/project/updateHandler';

import { schemaValidationMiddleware } from '../middleware/schemaValidationMiddleware';
import {
  getProjectSchema,
  updateProjectSchema,
  createProjectSchema,
  deleteProjectSchema,
  searchProjectSchema,
  isTakenProjectSchema,
} from '../zodSchemas/projectSchemas';
import { getProjectMiddleware } from '../middleware/getProjectMiddleware';
import { accessProjectMiddleware } from '../middleware/accessProjectMiddleware';

const router = express.Router();

router.post(
  '/create',
  authMiddleware,
  schemaValidationMiddleware(createProjectSchema),
  createHandler
);

router.post(
  '/delete',
  authMiddleware,
  schemaValidationMiddleware(deleteProjectSchema),
  accessProjectMiddleware,
  deleteHandler
);

router.post(
  '/get',
  authMiddleware,
  schemaValidationMiddleware(getProjectSchema),
  getProjectMiddleware,
  getHandler
);

router.post(
  '/is-taken',
  authMiddleware,
  schemaValidationMiddleware(isTakenProjectSchema),
  isTakenHandler
);

router.post(
  '/search',
  authMiddleware,
  schemaValidationMiddleware(searchProjectSchema),
  searchHandler
);

router.post(
  '/update',
  authMiddleware,
  schemaValidationMiddleware(updateProjectSchema),
  accessProjectMiddleware,
  updateHandler
);

export default router;
