import { z } from 'zod';
import { connectToDatabase } from '../database';

export const registerSchema = z
  .object({
    user: z
      .object({
        email: z.string().email(),
        brainet_tag: z.string().min(Number(process.env.MIN_BRAINET_TAG_LENGTH)),
        plain_password: z.string().min(Number(process.env.MIN_PASS_LENGTH)),
      })
      .strict(),
  })
  .strict()
  .refine(
    async (data) => {
      const db = await connectToDatabase();
      const dbusers = db.collection('users');
      const userExists = await dbusers.findOne({
        $or: [
          { email: data.user.email },
          { brainet_tag: data.user.brainet_tag },
        ],
      });
      return userExists === null;
    },
    { message: 'User with that email or brainet_tag already exists.' }
  );

export const loginSchema = z
  .object({
    user: z
      .object({
        email: z.string().email().optional(),
        brainet_tag: z
          .string()
          .min(Number(process.env.MIN_BRAINET_TAG_LENGTH))
          .optional(),
        plain_password: z.string().min(Number(process.env.MIN_PASS_LENGTH)),
      })
      .strict(),
  })
  .strict()
  .refine(
    async (data) => {
      if (!data.user.email && !data.user.brainet_tag) {
        return false;
      }
      return true;
    },
    { message: 'Either email or brainet_tag must be provided' }
  );

export const logoutSchema = z.object({}).strict();
