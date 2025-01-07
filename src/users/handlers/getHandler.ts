import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';

export const getHandler = async (
  userId: Types.ObjectId,
  req: Request,
  res: Response
) => {
  const user = await UserModel.findById(userId);
  if (user === null) {
    return res
      .status(404)
      .json({ msg: 'No user found matching the criteria.' });
  }

  const ownsProfile = user._id.toString() === req.userId?.toString();

  if (user.visibility === 'private' && !ownsProfile) {
    return res.status(403).json({
      msg: 'This user is private. You can only access private users if they follow you.',
    });
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

  return res.status(200).json({ user: userJson });
};
