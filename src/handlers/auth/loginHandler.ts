import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../mongooseSchemas/userSchema';

export const loginHandler = async (req: Request, res: Response) => {
  const given_user: any = {};
  if (req.body['user']['email']) given_user.email = req.body['user']['email'];
  if (req.body['user']['brainet_tag'])
    given_user.brainet_tag = req.body['user']['brainet_tag'];
  const query: any = await UserModel.findOne(given_user);
  if (query === null) {
    return res.status(404).json({ msg: 'User not found' });
  }
  const query_user = query;

  const isMatch = await bcrypt.compare(
    req.body['user'].plain_password,
    query_user.password_hash
  );

  if (!isMatch) {
    res.status(401).json({ msg: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign(
    { _id: '' + query_user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_TOKEN_EXPIRE_IN }
  );

  return res.status(200).json({ token: token });
};
