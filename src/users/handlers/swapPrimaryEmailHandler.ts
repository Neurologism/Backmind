import { Request } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export const swapPrimaryEmailHandler = async (
  userId: Types.ObjectId,
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
  const primaryEmail = user.emails.find(
    (email) => email.emailType === 'primary'
  );
  const secondaryEmail = user.emails.find(
    (email) => email.emailType === 'secondary'
  );

  if (!primaryEmail || !secondaryEmail) {
    throw new HttpException(
      'User does not have a primary or secondary email',
      HttpStatus.BAD_REQUEST
    );
  }

  if (!secondaryEmail.verified) {
    throw new HttpException(
      'Secondary email is not verified',
      HttpStatus.BAD_REQUEST
    );
  }

  primaryEmail.emailType = 'secondary';
  secondaryEmail.emailType = 'primary';
  await user.save();

  return { msg: 'Primary email swapped successfully' };
};
