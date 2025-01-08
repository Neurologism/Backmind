import { Request } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

export const checkHandler = async (req: Request) => {
  const user = await UserModel.findOne({
    _id: req.userId,
  });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  return { loggedIn: true };
};
