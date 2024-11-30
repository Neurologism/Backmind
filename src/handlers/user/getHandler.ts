import { Request, Response } from 'express';
import { isEmptyObject } from '../../utility/isEmptyObject';
import { UserModel } from '../../mongooseSchemas/userSchema';

export const getHandler = async (req: Request, res: Response) => {
  let searchParams;

  if (isEmptyObject(req.body)) {
    if (req.userId === undefined) {
      return res
        .status(401)
        .json({ msg: 'You are not authenticated but provided an empty body.' });
    }
    searchParams = {
      _id: req.userId,
    };
  } else {
    searchParams = req.body.user;
  }

  const user = await UserModel.findOne(searchParams);
  if (user === null) {
    return res
      .status(404)
      .json({ msg: 'No user found matching the criteria.' });
  }

  const isUser = user._id.toString() === req.userId?.toString();
  const isFollowedByUser = (() => {
    for (const followingId of user.followingIds) {
      if (followingId._id.toString() === req.userId?.toString()) {
        return true;
      }
      return false;
    }
  })();

  if (user.visibility === 'private' && !isUser && !isFollowedByUser) {
    return res.status(403).json({
      msg: 'This user is private. You can only access private users if they follow you.',
    });
  }

  const userJson = {
    _id: user._id,
    aboutYou: user.aboutYou,
    displayname: user.displayname,
    brainetTag: user.brainetTag,
    visibility: user.visibility,
    projectIds: user.projectIds,
    followerIds: user.followerIds,
    followingIds: user.followingIds,
  } as any;
  if (isUser) {
    userJson.dateOfBirth = user.dateOfBirth;
    userJson.emails = [];
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
