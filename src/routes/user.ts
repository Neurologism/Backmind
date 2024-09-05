import express from 'express';
import { dbMiddleware } from '../middleware/dbMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  searchUser,
} from '../controllers/userController';

const router = express.Router();

/**
 * @swagger
 * /api/user/get:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/get', dbMiddleware, authMiddleware, getUser);

/**
 * @swagger
 * /api/user/update:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/update', dbMiddleware, authMiddleware, updateUser);

/**
 * @swagger
 * /api/user/delete:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/delete', dbMiddleware, authMiddleware, deleteUser);

/**
 * @swagger
 * /api/user/follow:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/follow', dbMiddleware, authMiddleware, followUser);

/**
 * @swagger
 * /api/user/unfollow:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/unfollow', dbMiddleware, authMiddleware, unfollowUser);

/**
 * @swagger
 * /api/user/search:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/search', dbMiddleware, authMiddleware, searchUser);

export default router;
