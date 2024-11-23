import express from 'express';
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
} from '../zodSchemas/userSchemas';

const router = express.Router();

router.post(
  '/get',
  authMiddleware,
  schemaValidationMiddleware(getUserSchema),
  getUser
);

router.post(
  '/update',
  authMiddleware,
  schemaValidationMiddleware(updateUserSchema),
  updateUser
);

router.post(
  '/is-taken',
  authMiddleware,
  schemaValidationMiddleware(isTakenUserSchema),
  isTakenUser
);

router.post(
  '/search',
  authMiddleware,
  schemaValidationMiddleware(searchUserSchema),
  searchUser
);

router.post(
  '/delete',
  authMiddleware,
  schemaValidationMiddleware(deleteUserSchema),
  deleteUser
);

router.post(
  '/follow',
  authMiddleware,
  schemaValidationMiddleware(followUserSchema),
  followUser
);

router.post(
  '/unfollow',
  authMiddleware,
  schemaValidationMiddleware(unfollowUserSchema),
  unfollowUser
);

export default router;
