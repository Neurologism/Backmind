import { Request } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export const unfollowHandler = async (userId: Types.ObjectId, req: Request) => {
  const user = await UserModel.findById({ _id: req.userId });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  const userToUnfollow = await UserModel.findById(userId);

  if (!userToUnfollow) {
    throw new HttpException('User to unfollow not found', HttpStatus.NOT_FOUND);
  }

  if (!user.followingIds.includes(userId)) {
    throw new HttpException(
      'You are not following this user',
      HttpStatus.BAD_REQUEST
    );
  }

  user.followingIds = user.followingIds.filter(
    (id) => id.toString() !== userId.toString()
  );
  await user.save();

  userToUnfollow.followerIds = userToUnfollow.followerIds.filter(
    (id) => id.toString() !== user._id.toString()
  );
  await userToUnfollow.save();

  return { msg: 'User unfollowed successfully' };
};
