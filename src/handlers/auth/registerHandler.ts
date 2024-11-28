import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../mongooseSchemas/userSchema';

export const registerHandler = async (req: Request, res: Response) => {
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
