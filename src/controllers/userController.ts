import { Request, Response } from 'express';
import { RequestExplicit, User, UserExplicit, UserUpdate } from '../types';
import bcrypt from 'bcrypt';

const isEmptyObject = (obj: object) => JSON.stringify(obj) === '{}';

const sanitizeUser = (user: UserUpdate): UserUpdate => {
  const sanitizedUser = {
    email: user.email,
    about_you: user.about_you,
    displayname: user.displayname,
    brainet_tag: user.brainet_tag,
    date_of_birth: user.date_of_birth,
    visibility: user.visibility,
    new_password: user.new_password,
    old_password: user.old_password,
  };
  return sanitizedUser;
};

export const getUser = async (req: Request, res: Response) => {
  req as RequestExplicit;

  let search_params;

  if (isEmptyObject(req.body)) {
    if (req.user_id === undefined) {
      return res
        .status(401)
        .json({ msg: 'You are not authenticated but provided an empty body.' });
    }
    search_params = {
      _id: req.user_id,
    };
  } else {
    search_params = req.body.user;
  }

  const user = await req.dbusers!.findOne(search_params);
  if (user === null) {
    return res
      .status(404)
      .json({ msg: 'No user found matching the criteria.' });
  }

  const isUser = user._id.toString() === req.user_id?.toString();
  const isFollowedByUser = user.following_ids.includes(req.user_id!);

  if (user.visibility === 'private' && !isUser && !isFollowedByUser) {
    return res
      .status(403)
      .json({
        msg: 'This user is private. You can only access private users if they follow you.',
      });
  }

  user.password_hash = undefined;
  if (!isUser) {
    user.email = undefined;
    user.date_of_birth = undefined;
  }

  return res.status(200).json({ user: user });
};

export const updateUser = async (req: Request, res: Response) => {
  req as RequestExplicit;
  if (req.user_id === undefined) {
    return res.status(401).json({ msg: 'You are not authenticated.' });
  }
  const db_user = (await req.dbusers!.findOne({
    _id: req.user_id!,
  })) as unknown as UserExplicit;
  if (db_user === null) {
    return res.status(404).json({ msg: 'This user does not exist.' });
  }
  if (req.body['user'] === undefined) {
    return res.status(400).json({ msg: 'You need to provide a user object.' });
  }
  const user = sanitizeUser(req.body['user'] as UserUpdate);
  if (isEmptyObject(user)) {
    return res.status(400).json({ msg: 'You provided an empty user.' });
  }
  if (user.new_password !== undefined && user.old_password === undefined) {
    return res.status(400).json({
      msg: 'You need to provide the old password for a password change.',
    });
  }
  if (user.old_password !== undefined) {
    if (bcrypt.compareSync(user.old_password, db_user.password_hash)) {
      return res.status(400).json({ msg: 'The old password is incorrect.' });
    }
    if (user.new_password !== undefined) {
      user.password_hash = bcrypt.hashSync(
        user.new_password,
        Number(process.env.SALT_ROUNDS)
      );
      user.new_password = undefined;
    }
    user.old_password = undefined;
  }
  req.dbusers!.updateOne({ _id: req.user_id! }, { $set: user });
  return res.status(200).json({ msg: 'User updated successfully.' });
};

export const isTakenUser = async (req: Request, res: Response) => {
  req as RequestExplicit;
  if (req.body['user'] === undefined) {
    return res.status(400).json({ msg: 'You need to provide a user object.' });
  }
  if (
    req.body['user']['email'] === undefined &&
    req.body['user']['brainet_tag'] === undefined
  ) {
    return res
      .status(400)
      .json({ msg: 'You need to provide an email or a brainet_tag.' });
  }
  const search_properties = {
    $or: [
      { email: req.body['user']['email'] },
      { brainet_tag: req.body['user']['brainet_tag'] },
    ],
  };
  const user = await req.dbusers!.findOne(search_properties);
  if (user === null) {
    return res.status(200).json({ msg: 'This user is not taken.' });
  }
  return res
    .status(409)
    .json({ msg: 'This email or brainet tag is already in use.' });
};

export const deleteUser = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};

export const followUser = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};

export const unfollowUser = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};

export const searchUser = async (req: Request, res: Response) => {
  req as RequestExplicit;
  req.logger.error('Not implemented yet.');
};
