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

router.post('/get', dbMiddleware, authMiddleware, getUser);
router.post('/update', dbMiddleware, authMiddleware, updateUser);
router.post('/delete', dbMiddleware, authMiddleware, deleteUser);
router.post('/follow', dbMiddleware, authMiddleware, followUser);
router.post('/unfollow', dbMiddleware, authMiddleware, unfollowUser);
router.post('/search', dbMiddleware, authMiddleware, searchUser);

export default router;
