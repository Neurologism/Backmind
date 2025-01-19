import { UserDocument, UserModel } from '../../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

export const followHandler = async (
  userId: Types.ObjectId,
  loggedInUser: UserDocument
) => {
  if (loggedInUser._id.toString() === userId.toString()) {
    throw new HttpException(
      'You cannot follow yourself',
      HttpStatus.BAD_REQUEST
    );
  }

  const userToFollow = await UserModel.findById(userId);

  if (!userToFollow) {
    throw new HttpException('User to follow not found', HttpStatus.NOT_FOUND);
  }

  if (
    loggedInUser.followingIds.some((id) => id.toString() === userId.toString())
  ) {
    throw new HttpException(
      'You are already following this user',
      HttpStatus.BAD_REQUEST
    );
  }

  loggedInUser.followingIds.push(userId);
  await loggedInUser.save();

  userToFollow.followerIds.push(loggedInUser._id);
  await userToFollow.save();

  return { msg: 'User followed successfully' };
};
