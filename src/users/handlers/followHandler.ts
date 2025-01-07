import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';

export const followHandler = async (
  userId: Types.ObjectId,
  req: Request,
  res: Response
) => {
  const loggedInUser = await UserModel.findById({ _id: req.userId });

  if (!loggedInUser) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const userToFollow = await UserModel.findById(userId);

  if (!userToFollow) {
    return res.status(404).json({ msg: 'User to follow not found' });
  }

  if (
    loggedInUser.followingIds.some((id) => id.toString() === userId.toString())
  ) {
    return res.status(400).json({ msg: 'You are already following this user' });
  }

  loggedInUser.followingIds.push(userId);
  await loggedInUser.save();

  userToFollow.followerIds.push(loggedInUser._id);
  await userToFollow.save();

  return res.status(200).json({ msg: 'User followed successfully' });
};
