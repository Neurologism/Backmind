import { Request, Response } from 'express';
import { UserModel } from '../../mongooseSchemas/userSchema';

export const check = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({
    _id: req.user_id,
  });

  const userExists = user !== null;

  return res.status(200).json({ loggedIn: userExists });
};
