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

const router = express.Router();

router.post('/get', dbMiddleware, authMiddleware, getProject);

router.post('/update', dbMiddleware, authMiddleware, updateProject);

router.post('/create', dbMiddleware, authMiddleware, createProject);

router.post('/delete', dbMiddleware, authMiddleware, deleteProject);

router.post('/search', dbMiddleware, authMiddleware, searchProject);

router.post(
  '/model/training-start',
  dbMiddleware,
  authMiddleware,
  modelStartTraining
);

router.post(
  '/model/training-stop',
  dbMiddleware,
  authMiddleware,
  modelStopTraining
);

router.post(
  '/model/training-status',
  dbMiddleware,
  authMiddleware,
  modelStatusTraining
);

router.post('/model/query', dbMiddleware, authMiddleware, modelQuery);

router.post('/model/download', dbMiddleware, authMiddleware, modelDownload);

export default router;
