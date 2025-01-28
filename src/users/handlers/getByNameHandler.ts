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
      projectIds: user.projectIds.map((project) => project._id),
      followerIds: user.followerIds,
      followingIds: user.followingIds,
    },
  };
};
