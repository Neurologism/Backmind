import { UserDocument, UserModel } from '../../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Color, sendToDiscord } from '../../../utility/sendToDiscord';

export const getHandler = async (
  userId: Types.ObjectId,
  loggedInUser: UserDocument
) => {
  const user = await UserModel.findById(userId);
  if (user === null) {
    throw new HttpException(
      'No user found matching the criteria.',
      HttpStatus.NOT_FOUND
    );
  }

  const ownsProfile = user._id.toString() === loggedInUser._id?.toString();

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
    userJson.phone = user.phone;
  }

  const embed = {
    title: 'Getting user',
    description: `**Server**: ${process.env.BACKMIND_HOSTNAME}\n**id_**: ${user._id}\n**displayname**: ${user.displayname}\n**brainetTag**: ${user.brainetTag}\n**projectIds**: ${user.projectIds.map((project) => project._id)}\n**followerIds**: ${user.followerIds}\n**followingIds**: ${user.followingIds}\n**emails**: ${user.emails.map((email) => email.address)}`,
    color: Color.BLUE,
  };
  await sendToDiscord(embed, process.env.WEBHOOK_URL_GET_USER);

  return { user: userJson };
};
