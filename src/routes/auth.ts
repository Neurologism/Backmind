import express from 'express';
import { register, login, logout, check } from '../controllers/authController';
import { schemaValidationMiddleware } from '../middleware/schemaValidationMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  registerSchema,
  loginSchema,
  logoutSchema,
} from '../zodSchemas/authSchemas';
import { isEnabledMiddleware } from '../middleware/isTrueMiddleware';

const router = express.Router();

router.post(
  '/register',
  isEnabledMiddleware(!Boolean(process.env.DISABLE_ACCOUNT_CREATION as string)),
  schemaValidationMiddleware(registerSchema),
  register
);

router.post('/login', schemaValidationMiddleware(loginSchema), login);

router.post('/logout', schemaValidationMiddleware(logoutSchema), logout);

router.get('/check', authMiddleware, check);

export default router;
