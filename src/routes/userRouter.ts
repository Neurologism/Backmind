import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { deleteHandler } from '../handlers/user/deleteHandler';
import { followHandler } from '../handlers/user/followHandler';
import { getHandler } from '../handlers/user/getHandler';
import { getPfpHandler } from '../handlers/user/getPfpHandler';
import { isTakenHandler } from '../handlers/user/isTakenHandler';
import { searchHandler } from '../handlers/user/searchHandler';
import { unfollowHandler } from '../handlers/user/unfollowHandler';
import { updateHandler } from '../handlers/user/updateHandler';
import { uploadPfpHandler } from '../handlers/user/uploadPfpHandler';
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
} from '../zodSchemas/userSchemas';
import { pfpUploadMulter } from '../multerConfigs/pfpUpload';

const router = express.Router();

router.post(
  '/delete',
  authMiddleware,
  schemaValidationMiddleware(deleteUserSchema),
  deleteHandler
);

router.post(
  '/follow',
  authMiddleware,
  schemaValidationMiddleware(followUserSchema),
  followHandler
);

router.post(
  '/get',
  authMiddleware,
  schemaValidationMiddleware(getUserSchema),
  getHandler
);

router.get('/get-pfp/:userId', getPfpHandler);

router.post(
  '/is-taken',
  authMiddleware,
  schemaValidationMiddleware(isTakenUserSchema),
  isTakenHandler
);

router.post(
  '/search',
  authMiddleware,
  schemaValidationMiddleware(searchUserSchema),
  searchHandler
);

router.post(
  '/unfollow',
  authMiddleware,
  schemaValidationMiddleware(unfollowUserSchema),
  unfollowHandler
);

router.post(
  '/update',
  authMiddleware,
  schemaValidationMiddleware(updateUserSchema),
  updateHandler
);

router.post(
  '/upload-pfp',
  authMiddleware,
  schemaValidationMiddleware(uploadPfpSchema),
  pfpUploadMulter.single('pfp'),
  uploadPfpHandler
);

export default router;
