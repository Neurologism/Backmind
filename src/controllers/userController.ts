import { Request, Response } from 'express';
import { RequestExplicit, UserExplicit } from '../types';
import bcrypt from 'bcrypt';
import { isEmptyObject } from '../utility/isEmptyObject';

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

  const user = await req.dbUsers!.findOne(search_params);
  if (user === null) {
    return res
      .status(404)
      .json({ msg: 'No user found matching the criteria.' });
  }

  const isUser = user._id.toString() === req.user_id?.toString();
  const isFollowedByUser = user.following_ids.includes(req.user_id!);

  if (user.visibility === 'private' && !isUser && !isFollowedByUser) {
    return res.status(403).json({
      msg: 'This user is private. You can only access private users if they follow you.',
    });
  }

  delete user.password_hash;
  if (!isUser) {
    delete user.email;
    delete user.date_of_birth;
  }

  return res.status(200).json({ user: user });
};

export const updateUser = async (req: Request, res: Response) => {
  req as RequestExplicit;

  if (req.user_id === undefined) {
    return res.status(401).json({ msg: 'You are not authenticated.' });
  }

  const db_user = (await req.dbUsers!.findOne({
    _id: req.user_id!,
  })) as unknown as UserExplicit;

  if (db_user === null) {
    return res
      .status(404)
      .json({ msg: 'Authentication token invalid. Try relogging.' });
  }

  if (req.body.user.old_password !== undefined) {
    const passwordsMatch = bcrypt.compareSync(
      req.body.user.old_password,
      db_user.password_hash
    );
    if (!passwordsMatch) {
      return res.status(400).json({ msg: 'The old password is incorrect.' });
    }
    delete req.body.user.old_password;
  }

  if (req.body.user.new_password !== undefined) {
    req.body.password_hash = bcrypt.hashSync(
      req.body.user.new_password,
      Number(process.env.SALT_ROUNDS)
    );
    delete req.body.user.new_password;
  }

  req.dbUsers!.updateOne({ _id: req.user_id! }, { $set: req.body.user });
  return res.status(200).json({ msg: 'User updated successfully.' });
};

export const isTakenUser = async (req: Request, res: Response) => {
  req as RequestExplicit;

  const search_properties: { $or: { email?: any; brainet_tag?: any }[] } = {
    $or: [],
  };

  if (req.body.user.email !== undefined) {
    search_properties.$or.push({ email: req.body.user.email });
  }
  if (req.body.user.brainet_tag !== undefined) {
    search_properties.$or.push({ brainet_tag: req.body.user.brainet_tag });
  }

  const user = await req.dbUsers!.findOne(search_properties);
  if (user !== null) {
    return res
      .status(409)
      .json({ msg: 'This email or brainet tag is already in use.' });
  }
  return res.status(200).json({ msg: 'This user is not taken.' });
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
