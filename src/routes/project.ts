import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getProject,
  searchProject,
  updateProject,
  createProject,
  deleteProject,
  isTakenProject,
} from '../controllers/projectController';
import { schemaValidationMiddleware } from '../middleware/schemaValidationMiddleware';
import {
  getProjectSchema,
  updateProjectSchema,
  createProjectSchema,
  deleteProjectSchema,
  searchProjectSchema,
  isTakenProjectSchema,
} from '../zodSchemas/projectSchemas';
import projectModelRoutes from './project/model';
import { getProjectMiddleware } from '../middleware/getProjectMiddleware';
import { accessProjectMiddleware } from '../middleware/accessProjectMiddleware';

const router = express.Router();

router.post(
  '/get',
  authMiddleware,
  schemaValidationMiddleware(getProjectSchema),
  getProjectMiddleware,
  getProject
);

router.post(
  '/update',
  authMiddleware,
  schemaValidationMiddleware(updateProjectSchema),
  accessProjectMiddleware,
  updateProject
);

router.post(
  '/create',
  authMiddleware,
  schemaValidationMiddleware(createProjectSchema),
  createProject
);

router.post(
  '/delete',
  authMiddleware,
  schemaValidationMiddleware(deleteProjectSchema),
  accessProjectMiddleware,
  deleteProject
);

router.post(
  '/search',
  authMiddleware,
  schemaValidationMiddleware(searchProjectSchema),
  searchProject
);

router.post(
  '/is-taken',
  authMiddleware,
  schemaValidationMiddleware(isTakenProjectSchema),
  isTakenProject
);

router.use('/model', projectModelRoutes);

export default router;
