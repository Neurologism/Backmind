import { z } from 'zod';

export const updateSchema = z
  .object({
    user: z
      .object({
        brainetTag: z
          .string()
          .min(Number(process.env.MIN_BRAINET_TAG_LENGTH))
          .optional(),
        aboutYou: z.string().optional(),
        displayname: z.string().optional(),
        dateOfBirth: z.string().optional(),
        newPassword: z
          .string()
          .min(Number(process.env.MIN_PASS_LENGTH))
          .optional(),
        oldPassword: z.string().optional(),
        pronouns: z.string().optional(),
        company: z.string().optional(),
        location: z.string().optional(),
      })
      .strict(),
  })
  .strict();
// .refine(
//   (data) => {
//     return Object.keys(data.user).length > 0;
//   },
//   { message: 'Provide at least one field to update.' }
// )
// .refine(
//   (data) => {
//     return !(
//       data.user.newPassword !== undefined &&
//       data.user.oldPassword === undefined
//     );
//   },
//   { message: 'You need to provide the old password for a password change.' }
// );

export type UpdateDto = z.infer<typeof updateSchema>;
