import express from 'express';
import { dbMiddleware } from '../middleware/dbMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getProject,
  searchProject,
  updateProject,
  createProject,
  deleteProject,
  modelStartTraining,
  modelStopTraining,
  modelStatusTraining,
  modelQuery,
  modelDownload,
} from '../controllers/projectController';
import { schemaValidationMiddleware } from '../middleware/schemaValidationMiddleware';
import {
  getProjectSchema,
  updateProjectSchema,
  createProjectSchema,
  deleteProjectSchema,
  searchProjectSchema,
  modelStartTrainingSchema,
  modelStopTrainingSchema,
  modelStatusTrainingSchema,
  modelQuerySchema,
  modelDownloadSchema,
} from '../schemas/projectSchemas';

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

router.post(
  '/model/training-start',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(modelStartTrainingSchema),
  modelStartTraining
);

router.post(
  '/model/training-stop',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(modelStopTrainingSchema),
  modelStopTraining
);

router.post(
  '/model/training-status',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(modelStatusTrainingSchema),
  modelStatusTraining
);

router.post(
  '/model/query',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(modelQuerySchema),
  modelQuery
);

router.post(
  '/model/download',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(modelDownloadSchema),
  modelDownload
);

export default router;
