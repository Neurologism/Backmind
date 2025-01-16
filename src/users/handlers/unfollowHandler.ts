import { UserDocument, UserModel } from '../../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export const unfollowHandler = async (
  userId: Types.ObjectId,
  loggedInUser: UserDocument
) => {
  const userToUnfollow = await UserModel.findById(userId);

  if (!userToUnfollow) {
    throw new HttpException('User to unfollow not found', HttpStatus.NOT_FOUND);
  }

  if (!loggedInUser.followingIds.includes(userId)) {
    throw new HttpException(
      'You are not following this loggedInUser',
      HttpStatus.BAD_REQUEST
    );
  }

  loggedInUser.followingIds = loggedInUser.followingIds.filter(
    (id) => id.toString() !== userId.toString()
  );
  await loggedInUser.save();

  userToUnfollow.followerIds = userToUnfollow.followerIds.filter(
    (id) => id.toString() !== loggedInUser._id.toString()
  );
  await userToUnfollow.save();

  return { msg: 'User unfollowed successfully' };
};
