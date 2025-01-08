import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { LoginDto } from '../dto/login.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

export const loginHandler = async (body: LoginDto) => {
  const givenUser: any = {};
  if (body['user']['email'])
    givenUser.emails = {
      $elemMatch: {
        address: body['user']['email'],
      },
    };
  if (body['user']['brainetTag'])
    givenUser.brainetTag = body['user']['brainetTag'];
  const user: any = await UserModel.findOne(givenUser);
  if (user === null) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  const isMatch = await bcrypt.compare(
    body['user'].plainPassword,
    user.passwordHash
  );

  if (!isMatch) {
    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }

  const token = jwt.sign(
    { _id: '' + user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_TOKEN_EXPIRE_IN }
  );

  user.tokens.push({ token: token });
  const maxTokens = process.env.MAX_TOKENS
    ? parseInt(process.env.MAX_TOKENS)
    : 10;
  if (user.tokens.length > maxTokens) {
    user.tokens.shift();
  }
  await user.save();
  return { token: token };
};
