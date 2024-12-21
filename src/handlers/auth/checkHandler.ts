import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';

export const checkHandler = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({
    _id: req.userId,
  });

  const userExists = user !== null;

  return res.status(200).json({ loggedIn: userExists });
};
