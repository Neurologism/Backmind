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

const router = express.Router();

/**
 * @swagger
 * /api/user/get:
 *   post:
 *     summary: Retrieve a user.
 *     description: Use this to get a user by id or brainet_tag. If you want to get the user that is currently logged in, you leave the body empty, but make sure to include your token. If you want to get a user that has the account visibility set to private, the user will have to be a follower of you and you will also have to include your auth token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     brainet_tag:
 *                       type: string
 *       200:
 *         description: User retrieved successfully.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: No user found matching the criteria.
 *       500:
 *         description: Internal server error.
 *
 */
router.post('/get', dbMiddleware, authMiddleware, getUser);

/**
 * @swagger
 * /api/user/update:
 *   post:
 *     summary: Change account information.
 *     description: Use this, if you want to change account information, like email, about you, displayname, brainet_tag, password, date_of_birth, visibility. You can only change the account data if you're loggged in as the corresponding user. If you want to change the password, you will have to provide the old password.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     brainet_tag:
 *                       type: string
 *                       description: Use '/api/user/is_taken' to make sure this brainet tag isn't already taken.
 *                     email:
 *                       type: string
 *                       description: Use '/api/user/is_taken' to make sure the email isn't already in use.
 *                     about_you:
 *                       type: string
 *                     displayname:
 *                       type: string
 *                     date_of_birth:
 *                       type: integer
 *                       description: This needs to be a valid unix timestamp of the day.
 *                     visibility:
 *                       type: string
 *                       description: This needs to be either 'private' or 'public'.
 *                     new_password:
 *                       type: string
 *                     old_password:
 *                       type: string
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Internal server error.
 *
 */
router.post('/update', dbMiddleware, authMiddleware, updateUser);

/**
 * @swagger
 * /api/user/is_taken:
 *   post:
 *     summary: Check if an email or brainet tag is taken.
 *     description: This api endpoint is used to show the user just after he finished typing in his potentially new email or brainet tag if it is available or it isn't.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     brainet_tag:
 *                       type: string
 *                     email:
 *                       type: string
 *       200:
 *         description: The email or brainet tag is not in use yet.
 *       400:
 *         description: Invalid input.
 *       409:
 *         description: The email or brainet tag is already in use.
 *       500:
 *         description: Internal server error.
 */
router.get('/is_taken', dbMiddleware, authMiddleware, isTakenUser);

/**
 * @swagger
 * /api/user/search:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/search', dbMiddleware, authMiddleware, searchUser);

/**
 * @swagger
 * /api/user/delete:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/delete', dbMiddleware, authMiddleware, deleteUser);

/**
 * @swagger
 * /api/user/follow:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/follow', dbMiddleware, authMiddleware, followUser);

/**
 * @swagger
 * /api/user/unfollow:
 *   post:
 *     summary: in developement
 *     deprecated: true
 */
router.post('/unfollow', dbMiddleware, authMiddleware, unfollowUser);

export default router;
