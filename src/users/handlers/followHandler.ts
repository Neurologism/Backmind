import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';

export const followHandler = async (req: Request, res: Response) => {
  const user = await UserModel.findById({ _id: req.userId });

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const userToFollow = await UserModel.findById(req.body.userId);

  if (!userToFollow) {
    return res.status(404).json({ msg: 'User to follow not found' });
  }

  if (user.followingIds.includes(req.body.userId)) {
    return res.status(400).json({ msg: 'You are already following this user' });
  }

  user.followingIds.push(req.body.userId);
  await user.save();

  userToFollow.followerIds.push(user._id);
  await userToFollow.save();

  return res.status(200).json({ msg: 'User followed successfully' });
};
