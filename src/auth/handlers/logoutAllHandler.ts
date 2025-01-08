import { Request } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

export const logoutAllHandler = async (req: Request) => {
  const user = await UserModel.findById({ _id: req.userId });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  user.tokens = [] as any;
  await user.save();

  return { msg: 'User logged out from all devices' };
};
