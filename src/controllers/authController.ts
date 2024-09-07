import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserLogin, UserRegister, UserExplicit } from '../types';

export const register = async (req: Request, res: Response) => {
  let given_user: UserRegister = req.body['user'];
  const userExists = await req.dbusers!.findOne({
    $or: [{ email: given_user.email }, { brainet_tag: given_user.brainet_tag }],
  });
  if (userExists) {
    return res
      .status(400)
      .json({ message: 'User with that email or brainet_tag already exists' });
  }

  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  const hashedPassword = await bcrypt.hash(given_user.plain_password, salt);

  const newUser: User = {
    email: given_user.email,
    brainet_tag: given_user.brainet_tag,
    displayname: given_user.brainet_tag,
    password_hash: hashedPassword,
    about_you: '',
    date_of_birth: 0,
    visibility: 'public',
    created_on: Date.now(),
    project_ids: [],
    follower_ids: [],
    following_ids: [],
  };

  const result = await req.dbusers!.insertOne(newUser);

  const token = jwt.sign(
    { _id: '' + result.insertedId },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_TOKEN_EXPIRE_IN || '1h' }
  );

  res.status(201).json({ message: 'User registered successfully', token: token });
};

export const login = async (req: Request, res: Response) => {
  const query = await req.dbusers!.findOne({
    email: req.body['user'].email,
    brainet_tag: req.body['user'].brainet_tag,
  });
  if (query === null) {
    return res.status(404).send('User not found');
  }
  const query_user = query as UserExplicit;

  const isMatch = await bcrypt.compare(
    req.body['user'].plain_password,
    query_user.password_hash
  );

  if (!isMatch) {
    res.status(401).send('Invalid credentials');
    return;
  }

  const token = jwt.sign(
    { _id: '' + query_user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_TOKEN_EXPIRE_IN || '1h' }
  );

  return res.status(200).json({ token: token });
};

export const logout = async (req: Request, res: Response) => {
  req.logger.error('Not implemented yet.');
};
