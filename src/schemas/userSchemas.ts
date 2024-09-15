import { z } from 'zod';
import { ObjectId } from 'mongodb';

export const getUserSchema = z
  .object({
    user: z
      .object({
        _id: z
          .string()
          .optional()
          .transform((_id) => {
            if (_id !== undefined) {
              return new ObjectId(_id);
            }
          }),
        brainet_tag: z.string().optional(),
      })
      .optional(),
  })
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

export const updateUserSchema = z.object({});

export const deleteUserSchema = z.object({});

export const followUserSchema = z.object({});

export const unfollowUserSchema = z.object({});

export const searchUserSchema = z.object({});

export const isTakenUserSchema = z.object({});
