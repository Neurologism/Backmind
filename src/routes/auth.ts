import express from 'express';
import { dbMiddleware } from '../middleware/dbMiddleware';
import { register, login, logout } from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     responses:
 *       201:
 *         description: successfully registered
 *       400:
 *         description: email or brainet tag already in use
 */
router.post('/register', dbMiddleware, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Register a new user
 *     responses:
 *       404:
 *         description: user not found
 *       401:
 *         description: invalid credentials
 */
router.post('/login', dbMiddleware, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/logout', dbMiddleware, logout);

export default router;
