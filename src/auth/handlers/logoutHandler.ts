import { Request } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

export const logoutHandler = async (req: Request) => {
  const user = await UserModel.findById({ _id: req.userId });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new HttpException('Token not found', HttpStatus.BAD_REQUEST);
  }

  user.tokens = user.tokens.filter((t) => t.token !== token);
  await user.save();

  return { msg: 'User logged out successfully' };
};
