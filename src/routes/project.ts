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

/**
 * @swagger
 * /api/project/get:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/get', dbMiddleware, authMiddleware, getProject);

/**
 * @swagger
 * /api/project/search:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/search', dbMiddleware, authMiddleware, searchProject);

/**
 * @swagger
 * /api/project/update:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/update', dbMiddleware, authMiddleware, updateProject);

/**
 * @swagger
 * /api/project/create:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/create', dbMiddleware, authMiddleware, createProject);

/**
 * @swagger
 * /api/project/delete:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/delete', dbMiddleware, authMiddleware, deleteProject);

/**
 * @swagger
 * /api/project/model/training-start:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post(
  '/model/training-start',
  dbMiddleware,
  authMiddleware,
  modelStartTraining
);

/**
 * @swagger
 * /api/project/model/training-stop:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post(
  '/model/training-stop',
  dbMiddleware,
  authMiddleware,
  modelStopTraining
);

/**
 * @swagger
 * /api/project/model/training-status:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post(
  '/model/training-status',
  dbMiddleware,
  authMiddleware,
  modelStatusTraining
);

/**
 * @swagger
 * /api/project/model/query:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/model/query', dbMiddleware, authMiddleware, modelQuery);

/**
 * @swagger
 * /api/project/model/download:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/model/download', dbMiddleware, authMiddleware, modelDownload);

export default router;
