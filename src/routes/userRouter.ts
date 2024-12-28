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
import { swapPrimaryEmailHandler } from '../handlers/user/swapPrimaryEmailHandler';
import { schemaValidationMiddleware } from '../middleware/schemaValidationMiddleware';
import { updateSecondaryEmailHandler } from '../handlers/user/updateSecondaryEmailHandler';
import { deleteSecondaryEmailHandler } from '../handlers/user/deleteSecondaryEmailHandler';
import { getSchema } from '../zodSchemas/user/getSchema';
import { updateSchema } from '../zodSchemas/user/updateSchema';
import { deleteSchema } from '../zodSchemas/user/deleteSchema';
import { followSchema } from '../zodSchemas/user/followSchema';
import { unfollowSchema } from '../zodSchemas/user/unfollowSchema';
import { searchSchema } from '../zodSchemas/user/searchSchema';
import { isTakenSchema } from '../zodSchemas/user/isTakenSchema';
import { uploadPfpSchema } from '../zodSchemas/user/uploadPfpSchema';
// import { getPfpSchema } from '../zodSchemas/user/getPfpSchema';
import { getCreditsSchema } from '../zodSchemas/user/getCreditsSchema';
import { swapPrimaryEmailSchema } from '../zodSchemas/user/swapPrimaryEmailSchema';
import { updateSecondaryEmailSchema } from '../zodSchemas/user/updateSecondaryEmailSchema';
import { deleteSecondaryEmailSchema } from '../zodSchemas/user/deleteSecondaryEmailSchema';
import { pfpUploadMulter } from '../multerConfigs/pfpUpload';
import { getCredits } from '../handlers/user/getCredits';

const router = express.Router();

router.post(
  '/delete',
  authMiddleware,
  schemaValidationMiddleware(deleteSchema),
  deleteHandler
);

router.post(
  '/follow',
  authMiddleware,
  schemaValidationMiddleware(followSchema),
  followHandler
);

router.post(
  '/get',
  authMiddleware,
  schemaValidationMiddleware(getSchema),
  getHandler
);

router.get('/get-pfp/:userId', getPfpHandler);

router.post(
  '/is-taken',
  authMiddleware,
  schemaValidationMiddleware(isTakenSchema),
  isTakenHandler
);

router.post(
  '/search',
  authMiddleware,
  schemaValidationMiddleware(searchSchema),
  searchHandler
);

router.post(
  '/unfollow',
  authMiddleware,
  schemaValidationMiddleware(unfollowSchema),
  unfollowHandler
);

router.post(
  '/update',
  authMiddleware,
  schemaValidationMiddleware(updateSchema),
  updateHandler
);

router.post(
  '/upload-pfp',
  authMiddleware,
  schemaValidationMiddleware(uploadPfpSchema),
  pfpUploadMulter.single('pfp'),
  uploadPfpHandler
);

router.post(
  '/get-credits',
  authMiddleware,
  schemaValidationMiddleware(getCreditsSchema),
  getCredits
);

router.post(
  '/swap-primary-email',
  authMiddleware,
  schemaValidationMiddleware(swapPrimaryEmailSchema),
  swapPrimaryEmailHandler
);

router.post(
  '/update-secondary-email',
  authMiddleware,
  schemaValidationMiddleware(updateSecondaryEmailSchema),
  updateSecondaryEmailHandler
);

router.post(
  '/delete-secondary-email',
  authMiddleware,
  schemaValidationMiddleware(deleteSecondaryEmailSchema),
  deleteSecondaryEmailHandler
);

export default router;
