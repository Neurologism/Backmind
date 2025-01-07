import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';
import { Types } from 'mongoose';

export const getCreditsHandler = async (
  userId: Types.ObjectId,
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

  return res.status(200).json({ remainingCredits: user.remainingCredits });
};
