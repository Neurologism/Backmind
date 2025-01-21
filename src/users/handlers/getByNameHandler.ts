import { UserModel } from '../../../mongooseSchemas/user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getByNameHandler = async (brainetTag: string) => {
  const user = await UserModel.findOne({
    brainetTag: brainetTag,
  });
  if (user === null) {
    throw new HttpException(
      'No user found matching the criteria.',
      HttpStatus.NOT_FOUND
    );
  }

  if (user.visibility === 'private') {
    throw new HttpException(
      'This user is private. You can only access private users if they follow you.',
      HttpStatus.FORBIDDEN
    );
  }

  const query = {
    isTutorialProject: false,
  } as any;

  await user.populate({
    path: 'projectIds',
    match: query,
    select: '_id',
  });

  return {
    user: {
      _id: user._id,
      aboutYou: user.aboutYou,
      displayname: user.displayname,
      brainetTag: user.brainetTag,
      visibility: user.visibility,
      projectIds: user.projectIds.map((project) => project._id),
      followerIds: user.followerIds,
      followingIds: user.followingIds,
    },
  };
};
