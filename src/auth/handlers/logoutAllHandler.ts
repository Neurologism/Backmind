import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';

export const logoutAllHandler = async (req: Request, res: Response) => {
  const user = await UserModel.findById({ _id: req.userId });

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  user.tokens = [] as any;
  await user.save();

  return res.status(200).json({ msg: 'User logged out from all devices' });
};
