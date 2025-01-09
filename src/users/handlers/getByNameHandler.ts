import { UserModel } from '../../../mongooseSchemas/user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

export const getByNameHandler = async (
  brainetTag: string,
  loggedInUserId: Types.ObjectId
) => {
  const user = await UserModel.findOne({
    brainetTag: brainetTag,
  });
  if (user === null) {
    throw new HttpException(
      'No user found matching the criteria.',
      HttpStatus.NOT_FOUND
    );
  }

  const ownsProfile = user._id.toString() === loggedInUserId?.toString();

  if (user.visibility === 'private' && !ownsProfile) {
    throw new HttpException(
      'This user is private. You can only access private users if they follow you.',
      HttpStatus.FORBIDDEN
    );
  }

  const query = {
    isTutorialProject: false,
  } as any;

  if (!ownsProfile) {
    query['visibility'] = 'public';
  }

  await user.populate({
    path: 'projectIds',
    match: query,
    select: '_id',
  });

  const userJson = {
    _id: user._id,
    aboutYou: user.aboutYou,
    displayname: user.displayname,
    brainetTag: user.brainetTag,
    visibility: user.visibility,
    projectIds: user.projectIds.map((project) => project._id),
    followerIds: user.followerIds,
    followingIds: user.followingIds,
  } as any;
  if (ownsProfile) {
    userJson.dateOfBirth = user.dateOfBirth;
    userJson.emails = [];
    userJson.remainingCredits = user.remainingCredits;
    for (const email of user.emails) {
      userJson.emails.push({
        emailType: email.emailType,
        address: email.address,
        verified: email.verified,
      });
    }
  }

  return { user: userJson };
};
