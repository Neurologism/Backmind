import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';

export const getCreditsHandler = async (req: Request, res: Response) => {
  const user = await UserModel.findById({ _id: req.userId });
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  return res.status(200).json({ remainingCredits: user.remainingCredits });
};
