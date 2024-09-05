import express from 'express';
import { dbMiddleware } from '../middleware/dbMiddleware';
import { register, login, logout } from '../controllers/authController';

const router = express.Router();

router.post('/register', dbMiddleware, register);
router.post('/login', dbMiddleware, login);
router.post('/logout', dbMiddleware, logout);

export default router;
