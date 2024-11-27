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
  uploadPfp,
  getPfp,
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
  uploadPfpSchema,
  getPfpSchema,
} from '../zodSchemas/userSchemas';
import { pfpUploadMulter } from '../multerConfigs/pfpUpload';

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

router.post(
  '/upload-pfp',
  authMiddleware,
  schemaValidationMiddleware(uploadPfpSchema),
  pfpUploadMulter.single('pfp'),
  uploadPfp
);

router.post('/get-pfp', schemaValidationMiddleware(getPfpSchema), getPfp);

export default router;
