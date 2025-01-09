import { UserModel } from '../../../mongooseSchemas/user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

export const logoutAllHandler = async (userId: Types.ObjectId) => {
  const user = await UserModel.findById({ _id: userId });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  user.tokens = [] as any;
  await user.save();

  return { msg: 'User logged out from all devices' };
};
