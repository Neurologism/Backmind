import express from 'express';
import { dbMiddleware } from '../middleware/dbMiddleware';
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
} from '../schemas/projectSchemas';
import projectModelRoutes from './projectModelRoutes';
import { getProjectMiddleware } from '../middleware/getProjectMiddleware';
import { accessProjectMiddleware } from '../middleware/accessProjectMiddleware';

const router = express.Router();

router.post(
  '/get',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(getProjectSchema),
  getProjectMiddleware,
  getProject
);

router.post(
  '/update',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(updateProjectSchema),
  accessProjectMiddleware,
  updateProject
);

router.post(
  '/create',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(createProjectSchema),
  createProject
);

router.post(
  '/delete',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(deleteProjectSchema),
  accessProjectMiddleware,
  deleteProject
);

router.post(
  '/search',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(searchProjectSchema),
  searchProject
);

router.post(
  '/is-taken',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(isTakenProjectSchema),
  isTakenProject
);

router.use('/model', projectModelRoutes);

export default router;
