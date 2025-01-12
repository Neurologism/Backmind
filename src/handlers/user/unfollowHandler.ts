import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';

export const unfollowHandler = async (req: Request, res: Response) => {
  const user = await UserModel.findById({ _id: req.userId });

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const userToUnfollow = await UserModel.findById(req.body.userId);

  if (!userToUnfollow) {
    return res.status(404).json({ msg: 'User to unfollow not found' });
  }

  if (!user.followingIds.includes(req.body.userId)) {
    return res.status(400).json({ msg: 'You are not following this user' });
  }

  user.followingIds.pull(req.body.userId);
  await user.save();

  userToUnfollow.followerIds.pull(user._id);
  await userToUnfollow.save();

  return res.status(200).json({ msg: 'User unfollowed successfully' });
};
