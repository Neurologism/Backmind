import { z } from 'zod';
import { UserModel } from '../mongooseSchemas/userSchema';

export const registerSchema = z
  .object({
    user: z
      .object({
        email: z.string().email(),
        brainetTag: z.string().min(Number(process.env.MIN_BRAINET_TAG_LENGTH)),
        plainPassword: z.string().min(Number(process.env.MIN_PASS_LENGTH)),
      })
      .strict(),
  })
  .strict()
  .refine(
    async (data) => {
      const userExists =
        (await UserModel.findOne({
          $or: [
            { 'emails.address': data.user.email },
            { brainetTag: data.user.brainetTag },
          ],
        })) === null;
      return userExists;
    },
    { message: 'User with that email or brainetTag already exists.' }
  );

export const loginSchema = z
  .object({
    user: z
      .object({
        email: z.string().email().optional(),
        brainetTag: z
          .string()
          .min(Number(process.env.MIN_BRAINET_TAG_LENGTH))
          .optional(),
        plainPassword: z.string().min(Number(process.env.MIN_PASS_LENGTH)),
      })
      .strict(),
  })
  .strict()
  .refine(
    async (data) => {
      if (!data.user.email && !data.user.brainetTag) {
        return false;
      }
      return true;
    },
    { message: 'Either email or brainetTag must be provided' }
  );

export const logoutSchema = z.object({}).strict();
