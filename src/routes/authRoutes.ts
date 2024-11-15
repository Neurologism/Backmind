import express from 'express';
import { dbMiddleware } from '../middleware/dbMiddleware';
import { register, login, logout, check } from '../controllers/authController';
import { schemaValidationMiddleware } from '../middleware/schemaValidationMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  registerSchema,
  loginSchema,
  logoutSchema,
} from '../schemas/authSchemas';
import { isEnabledMiddleware } from '../middleware/isTrueMiddleware';

const router = express.Router();

router.post(
  '/register',
  isEnabledMiddleware(!Boolean(process.env.DISABLE_ACCOUNT_CREATION as string)),
  dbMiddleware,
  schemaValidationMiddleware(registerSchema),
  register
);

router.post(
  '/login',
  dbMiddleware,
  schemaValidationMiddleware(loginSchema),
  login
);

router.post(
  '/logout',
  dbMiddleware,
  schemaValidationMiddleware(logoutSchema),
  logout
);

router.get('/check', dbMiddleware, authMiddleware, check);

export default router;
