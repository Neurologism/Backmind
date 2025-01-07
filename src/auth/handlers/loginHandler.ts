import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { LoginDto } from '../dto/login.schema';

export const loginHandler = async (body: LoginDto, res: Response) => {
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
    return res.status(404).json({ msg: 'User not found' });
  }

  const isMatch = await bcrypt.compare(
    body['user'].plainPassword,
    user.passwordHash
  );

  if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

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
  return res.status(200).json({ token: token });
};
