import { Request } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export const deleteEmailHandler = async (
  userId: Types.ObjectId,
  emailType: string,
  req: Request
) => {
  if (req.userId === undefined) {
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  if (req.userId?.toString() !== userId.toString()) {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  const user = await UserModel.findById({ _id: userId });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  const secondaryEmail = user.emails.find(
    (email) => email.emailType === emailType
  );

  if (!secondaryEmail) {
    throw new HttpException(
      'User does not have the specified email type',
      HttpStatus.BAD_REQUEST
    );
  }

  user.emails = user.emails.filter((email) => email.emailType !== emailType);
  await user.save();

  return { msg: 'Email deleted successfully' };
};
