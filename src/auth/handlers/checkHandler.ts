import { UserModel } from '../../../mongooseSchemas/user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

export const checkHandler = async (userId: Types.ObjectId) => {
  const user = await UserModel.findOne({
    _id: userId,
  });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  return { loggedIn: true };
};
