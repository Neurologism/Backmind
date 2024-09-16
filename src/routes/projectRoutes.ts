import express from 'express';
import { dbMiddleware } from '../middleware/dbMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getProject,
  searchProject,
  updateProject,
  createProject,
  deleteProject,
} from '../controllers/projectController';
import { schemaValidationMiddleware } from '../middleware/schemaValidationMiddleware';
import {
  getProjectSchema,
  updateProjectSchema,
  createProjectSchema,
  deleteProjectSchema,
  searchProjectSchema,
} from '../schemas/projectSchemas';
import projectModelRoutes from './projectModelRoutes';

const router = express.Router();

router.post(
  '/get',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(getProjectSchema),
  getProject
);

router.post(
  '/update',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(updateProjectSchema),
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
  deleteProject
);

router.post(
  '/search',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(searchProjectSchema),
  searchProject
);

router.use('/model', projectModelRoutes);

export default router;
