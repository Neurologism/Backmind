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
  isTakenUser,
} from '../controllers/userController';
import { schemaValidationMiddleware } from '../middleware/schemaValidationMiddleware';
import {
  getUserSchema,
  updateUserSchema,
  deleteUserSchema,
  followUserSchema,
  unfollowUserSchema,
  searchUserSchema,
  isTakenUserSchema,
} from '../schemas/userSchemas';

const router = express.Router();

router.post(
  '/get',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(getUserSchema),
  getUser
);

router.post(
  '/update',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(updateUserSchema),
  updateUser
);

router.post(
  '/is-taken',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(isTakenUserSchema),
  isTakenUser
);

router.post(
  '/search',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(searchUserSchema),
  searchUser
);

router.post(
  '/delete',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(deleteUserSchema),
  deleteUser
);

router.post(
  '/follow',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(followUserSchema),
  followUser
);

router.post(
  '/unfollow',
  dbMiddleware,
  authMiddleware,
  schemaValidationMiddleware(unfollowUserSchema),
  unfollowUser
);

export default router;
