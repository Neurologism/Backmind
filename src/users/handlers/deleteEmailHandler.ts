import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';

export const deleteEmailHandler = async (
  userId: Types.ObjectId,
  emailType: string,
  req: Request,
  res: Response
) => {
  if (req.userId === undefined) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  if (req.userId?.toString() !== userId.toString()) {
    return res.status(403).json({ msg: 'Forbidden' });
  }

  const user = await UserModel.findById({ _id: userId });

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const secondaryEmail = user.emails.find(
    (email) => email.emailType === emailType
  );

  if (!secondaryEmail) {
    return res
      .status(400)
      .json({ msg: 'User does not have the specified email type' });
  }

  user.emails = user.emails.filter((email) => email.emailType !== emailType);
  await user.save();

  return res.status(200).json({ msg: 'Email deleted successfully' });
};
