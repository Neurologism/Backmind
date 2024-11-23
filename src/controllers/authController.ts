import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../mongooseSchemas/userSchema';

export const register = async (req: Request, res: Response) => {
  const given_user = req.body['user'];

  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  const hashedPassword = await bcrypt.hash(given_user.plain_password, salt);

  const newUser = new UserModel({
    email: given_user.email,
    brainet_tag: given_user.brainet_tag,
    displayname: given_user.brainet_tag,
    password_hash: hashedPassword,
    about_you: '',
    date_of_birth: 0,
    visibility: 'public',
    created_on: new Date(),
    last_edited: new Date(),
    project_ids: [],
    follower_ids: [],
    following_ids: [],
  });

  const savedUser = await newUser.save();

  const token = jwt.sign(
    { _id: '' + savedUser._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_TOKEN_EXPIRE_IN }
  );

  res.status(201).json({ msg: 'User registered successfully', token: token });
};

export const login = async (req: Request, res: Response) => {
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

export const logout = async (req: Request, res: Response) => {
  req.logger.error('Not implemented yet.');
};

export const check = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({
    _id: req.user_id,
  });

  const userExists = user !== null;

  return res.status(200).json({ loggedIn: userExists });
};
