import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';

export const unfollowHandler = async (
  userId: Types.ObjectId,
  req: Request,
  res: Response
) => {
  const user = await UserModel.findById({ _id: req.userId });

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const userToUnfollow = await UserModel.findById(userId);

  if (!userToUnfollow) {
    return res.status(404).json({ msg: 'User to unfollow not found' });
  }

  if (!user.followingIds.includes(userId)) {
    return res.status(400).json({ msg: 'You are not following this user' });
  }

  user.followingIds = user.followingIds.filter(
    (id) => id.toString() !== userId.toString()
  );
  await user.save();

  userToUnfollow.followerIds = userToUnfollow.followerIds.filter(
    (id) => id.toString() !== user._id.toString()
  );
  await userToUnfollow.save();

  return res.status(200).json({ msg: 'User unfollowed successfully' });
};
