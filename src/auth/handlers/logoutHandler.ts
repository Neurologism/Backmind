import { UserModel } from '../../../mongooseSchemas/user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

export const logoutHandler = async (userId: Types.ObjectId, token: string) => {
  const user = await UserModel.findById({ _id: userId });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  if (!token) {
    throw new HttpException('Token not found', HttpStatus.BAD_REQUEST);
  }

  user.tokens = user.tokens.filter((t) => t.token !== token);
  await user.save();

  return { msg: 'User logged out successfully' };
};
