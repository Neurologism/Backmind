import { UserModel } from '../../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getCreditsHandler = async (userId: Types.ObjectId) => {
  const user = await UserModel.findById({ _id: userId });
  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  return { remainingCredits: user.remainingCredits };
};
