import express from 'express';
import { checkHandler } from '../handlers/auth/checkHandler';
import { loginHandler } from '../handlers/auth/loginHandler';
import { logoutHandler } from '../handlers/auth/logoutHandler';
import { registerHandler } from '../handlers/auth/registerHandler';
import { schemaValidationMiddleware } from '../middleware/schemaValidationMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  registerSchema,
  loginSchema,
  logoutSchema,
} from '../zodSchemas/authSchemas';
import { isEnabledMiddleware } from '../middleware/isTrueMiddleware';

const router = express.Router();

router.get('/check', authMiddleware, checkHandler);

router.post('/login', schemaValidationMiddleware(loginSchema), loginHandler);

router.post('/logout', schemaValidationMiddleware(logoutSchema), logoutHandler);

router.post(
  '/register',
  isEnabledMiddleware(!Boolean(process.env.DISABLE_ACCOUNT_CREATION as string)),
  schemaValidationMiddleware(registerSchema),
  registerHandler
);

export default router;
