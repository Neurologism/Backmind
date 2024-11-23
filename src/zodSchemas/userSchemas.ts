import { z } from 'zod';
import mongoose from 'mongoose';
import { isEmptyObject } from '../utility/isEmptyObject';

export const getUserSchema = z
  .object({
    user: z
      .object({
        _id: z
          .string()
          .optional()
          .transform((_id) => {
            if (_id !== undefined) {
              return new mongoose.Types.ObjectId(_id);
            }
          }),
        brainet_tag: z.string().optional(),
      })
      .strict()
      .optional(),
  })
  .strict()
  .refine(
    async (data) => {
      if (data.user !== undefined && Object.keys(data.user).length === 0) {
        return false;
      }
      return true;
    },
    {
      message:
        'Provide user id or brainet tag. Do not provide an empty user object.',
    }
  );

export const updateUserSchema = z
  .object({
    user: z
      .object({
        brainet_tag: z
          .string()
          .min(Number(process.env.MIN_BRAINET_TAG_LENGTH))
          .optional(),
        email: z.string().optional(),
        about_you: z.string().optional(),
        displayname: z.string().optional(),
        date_of_birth: z.number().optional(),
        visibility: z.enum(['private', 'public']).optional(),
        new_password: z
          .string()
          .min(Number(process.env.MIN_PASS_LENGTH))
          .optional(),
        old_password: z.string().optional(),
      })
      .strict(),
  })
  .strict()
  .refine(
    (data) => {
      if (isEmptyObject(data.user)) {
        return false;
      }
      return true;
    },
    { message: 'Provide at least one field to update.' }
  )
  .refine(
    (data) => {
      if (
        data.user.new_password !== undefined &&
        data.user.old_password === undefined
      ) {
        return false;
      }
      return true;
    },
    { message: 'You need to provide the old password for a password change.' }
  );

export const isTakenUserSchema = z
  .object({
    user: z
      .object({
        brainet_tag: z.string().optional(),
        email: z.string().optional(),
      })
      .strict(),
  })
  .strict()
  .refine(
    (data) => {
      if (isEmptyObject(data.user)) {
        return false;
      }
      return true;
    },
    {
      message:
        'Provide either a brainet tag or an email to check if it is taken.',
    }
  );

export const deleteUserSchema = z.object({}).strict();

export const followUserSchema = z.object({}).strict();

export const unfollowUserSchema = z.object({}).strict();

export const searchUserSchema = z.object({}).strict();
