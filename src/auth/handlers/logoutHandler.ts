import { Request, Response } from 'express';
import { UserModel } from '../../../mongooseSchemas/user.schema';

export const logoutHandler = async (req: Request, res: Response) => {
  const user = await UserModel.findById({ _id: req.userId });

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(400).json({ msg: 'Token not found' });
  }

  user.tokens = user.tokens.filter((t) => t.token !== token);
  await user.save();

  return res.status(200).json({ msg: 'User logged out successfully' });
};
